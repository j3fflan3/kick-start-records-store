"use server";
import OrderEmailTemplate from "@/src/app/_components/email/OrderEmailTemplate";
import {
  DEFAULT_CURRENCY_CODE,
  DIGITAL_GOODS,
  PAYPAL_TOKEN,
  PAYPAL_TOKEN_EXPIRES_IN,
  PAYPAL_TOKEN_ISSUED_AT,
  PayPalAmount,
  PayPalBreakdown,
  PayPalItem,
  PayPalPaymentSource,
  PayPalSimpleAmount,
  PayPalUPC,
  PHYSICAL_GOODS,
} from "@/src/app/_library/model/paypal";
import {
  getRedis,
  isCacheItemExpired,
  newCacheObject,
} from "@/src/app/_library/server/redis";
import { getURL } from "@/src/app/_library/server/utilities";
import {
  calculateTax,
  itemsTotal,
  formatDollars,
} from "@/src/app/_library/utilities";
import { Mutex } from "async-mutex";
import { Resend } from "resend";
import { createClient } from "../supabase/server";

const redis = await getRedis();

// synchronization for Redis reads/writes
const mutex = new Mutex();

async function oAuthPayPalRequest() {
  const cacheObj = await newCacheObject(
    PAYPAL_TOKEN,
    PAYPAL_TOKEN_ISSUED_AT,
    PAYPAL_TOKEN_EXPIRES_IN
  );
  let tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) return;

  const release = await mutex.acquire();
  // double check expiration once again in case other ops were waiting
  // to acquire the lock.
  tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) {
    console.log("After mutex.acquire(), but token isn't expired.");
    release();
    return;
  }
  try {
    const auth_credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");
    // PayPal's oauth2 token endpoint
    const oath_api_url = `${process.env.PAYPAL_API_URL}/v1/oauth2/token`;

    const response = await fetch(oath_api_url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth_credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!response.ok) {
      throw new Error(`oAuthUSPSRequest: ${response.status}`);
    }
    const { access_token, expires_in } = await response.json();
    const issued_at = Date.now();
    const [token, expires, issued] = await Promise.all([
      redis.set(PAYPAL_TOKEN, access_token),
      redis.set(PAYPAL_TOKEN_EXPIRES_IN, expires_in),
      redis.set(PAYPAL_TOKEN_ISSUED_AT, issued_at),
    ]);
    console.log(`token: ${token}\expires: ${expires}\nissued: ${issued}`);
  } catch (error) {
    console.error(`Error retrieving PayPal access token: ${error.message}`);
  } finally {
    release();
  }
}

function getPayPalAmount(items, shippingCents, taxCents) {
  console.log(
    `getPayPalAmount\n\t${JSON.stringify(
      items
    )}\n\tshippingCents: ${shippingCents}\n\ttaxCents: ${taxCents}`
  );

  // Shipping and tax must be numbers
  const total = itemsTotal(items);
  const combinedTotal = itemsTotal(
    items,
    Number(shippingCents),
    Number(taxCents)
  );
  let tax = "0.00";
  if (taxCents > 0) {
    tax = (taxCents / 100).toFixed(2);
  }
  let shipping = "0.00";
  if (shippingCents > 0) {
    shipping = (shippingCents / 100).toFixed(2);
  }
  const item_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, total);
  const shipping_total = new PayPalSimpleAmount(
    DEFAULT_CURRENCY_CODE,
    shipping
  );
  // Handling is hard coded as "0.00" for now.
  const handling_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
  const tax_total = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, tax);
  const breakdown = new PayPalBreakdown(
    item_total,
    shipping_total,
    handling_total,
    tax_total
  );

  return new PayPalAmount(DEFAULT_CURRENCY_CODE, combinedTotal, breakdown);
}

// taxPercentFloat should be either 0, or a float representing a percentage
// e.g, 10.25% would be .1025
function getPayPalItems(items, taxPercentageFloat) {
  return items.map((item) => {
    const category =
      item.recordFormat === "Download" ? DIGITAL_GOODS : PHYSICAL_GOODS;

    const unit_amount = new PayPalSimpleAmount(
      DEFAULT_CURRENCY_CODE,
      formatDollars(item.price)
    );

    let tax_amount = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
    if (taxPercentageFloat > 0) {
      tax = calculateTax(taxPercentageFloat, item.price);
      tax_amount = new PayPalSimpleAmount(
        DEFAULT_CURRENCY_CODE,
        (tax / 100).toFixed(2)
      );
    }
    // hard coding the api path "records" for now.
    // TODO: Need to come up with a reusable
    // design to dynamically set the api path info.
    const itemURL = `${getURL()}records/${item.catalogId}`;
    return new PayPalItem(
      item.title,
      item?.count ?? 1,
      item.description,
      category,
      itemURL,
      item.image.url,
      unit_amount,
      tax_amount,
      item?.sku ?? "",
      item?.upc ? new PayPalUPC("UPC-A", item.upc) : null
    );
  });
}

function getPayPalPaymentSource(paymentType, experienceContext) {
  switch (paymentType) {
    case "paypal":
      return new PayPalPaymentSource(new PayPal(experienceContext), null);
    case "card":
      return new PayPalPaymentSource(null, experienceContext);
  }
}

async function sendOrderEmail(email, orderId, orderNumber, fullName) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const email64 = Buffer.from(email).toString("base64");
    const orderLink = `${getURL()}checkout/order-placed/${orderId}/${encodeURIComponent(email64)}`;
    console.log(
      `\n\ntop of sendOrderEmail\n\nemail:${email}\norderNumber:${orderNumber}\nfullName:${fullName}`
    );

    const { data, error } = await resend.emails.send({
      from: "Kick Start Records <info@kickstartrecords.com>",
      to: [`${email}`],
      bcc: process.env.ORDER_EMAIL_BCC,
      subject: `Kick Start Records Order #${orderNumber}`,
      react: OrderEmailTemplate({ orderNumber, fullName, orderLink }),
    });
    console.log(
      `sendOrderEmail:\n\tdata (resend id):\t${JSON.stringify(data, null, 2)}\n\terror:\t${JSON.stringify(error, null, 2)}`
    );
  } catch (error) {
    console.log(`error sending order email: ${JSON.stringify(error, null, 2)}`);
  }
}
async function sendBuyNowOrderEmail(email, orderId, orderNumber, fullName) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const email64 = Buffer.from(email).toString("base64");
    const orderLink = `${getURL()}buy-now/order/${orderId}/${encodeURIComponent(email64)}`;
    console.log(
      `\n\ntop of sendBuyNowOrderEmail\n\nemail:${email}\norderNumber:${orderNumber}\nfullName:${fullName}`
    );

    const { data, error } = await resend.emails.send({
      from: "Kick Start Records <info@kickstartrecords.com>",
      to: [`${email}`],
      bcc: process.env.ORDER_EMAIL_BCC,
      subject: `Kick Start Records Order #${orderNumber}`,
      react: OrderEmailTemplate({ orderNumber, fullName, orderLink }),
    });
    console.log(
      `sendBuyNowOrderEmail:\n\tdata (resend id):\t${JSON.stringify(data, null, 2)}\n\terror:\t${JSON.stringify(error, null, 2)}`
    );
  } catch (error) {
    console.log(
      `error sending buy-now order email: ${JSON.stringify(error, null, 2)}`
    );
  }
}

async function handlePayPalResponse(response) {
  try {
    const json = await response.json();
    return {
      data: json,
      error: null,
      status: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

async function getOrderDetail(_order_id, _email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_detail", {
    _order_id,
    _email,
  });
  if (error) {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
  }
  return { data, error };
}

export {
  getOrderDetail,
  getPayPalAmount,
  getPayPalItems,
  getPayPalPaymentSource,
  handlePayPalResponse,
  oAuthPayPalRequest,
  sendOrderEmail,
  sendBuyNowOrderEmail,
};
