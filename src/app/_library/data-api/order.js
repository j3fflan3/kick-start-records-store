import {
  CacheObject,
  redis,
  isCacheItemExpired,
} from "@/src/app/_library/data-api/redis";
import { Mutex } from "async-mutex";
import { createClient } from "@/src/app/_library/supabase/server";
import {
  DEFAULT_CURRENCY_CODE,
  DIGITAL_GOODS,
  GET_FROM_FILE,
  PayPal,
  PayPalAmount,
  PayPalBreakdown,
  PayPalExperienceContext,
  PayPalItem,
  PayPalName,
  PayPalOrder,
  PayPalPayee,
  PayPalPaymentSource,
  PayPalPurchaseUnit,
  PayPalShipping,
  PayPalSimpleAmount,
  PayPalUPC,
  PHYSICAL_GOODS,
} from "./paypal";
import { ApiError } from "@paypal/paypal-server-sdk";
import { Resend } from "resend";
import OrderEmailTemplate from "../_components/email/OrderEmailTemplate";

const PAYPAL_TOKEN = "PAYPAL_TOKEN";
const PAYPAL_TOKEN_EXPIRES_IN = "PAYPAL_TOKEN_EXPIRES_IN";
const PAYPAL_TOKEN_ISSUED_AT = "PAYPAL_TOKEN_ISSUED_AT";

// Order Related API Calls
async function serverCreateOrderPlaceholder(shoppingCartId, email) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order_placeholder", {
    _shopping_cart_id: shoppingCartId,
    _email: email,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `serverCreateOrderPlaceholder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

async function serverCreateOrder(sCreateOrderArgs) {
  const coa = JSON.parse(sCreateOrderArgs);
  console.log(`createOrderArgs: ${JSON.stringify(coa)}`);
  const {
    cart,
    purchaseEmail: email,
    shippingCostCents,
    taxPercentageFloat,
    paymentSource: paymentType,
  } = coa;
  const { shopping_cart_id: shoppingCartId } = cart[0];
  const { data, error } = await serverCreateOrderPlaceholder(
    shoppingCartId,
    email
  );
  if (error) throw new Error(error.message);
  const { order_number: invoice_id, order_id: reference_id } = data;

  // Make sure the access_token isn't expired
  await oAuthPayPalRequest();
  const create_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
  // first, items array
  const payPalItems = getPayPalItems(cart, taxPercentageFloat);
  console.log(
    `serverCreateOrder\n\t payPalItems = ${JSON.stringify(payPalItems)}`
  );

  // getPayPalAmount
  let tax = 0;
  if (taxPercentageFloat > 0) {
    tax = cartTax(cart, taxPercentageFloat);
    console.log(`tax: ${tax}\n`);
  }
  const payPalAmount = getPayPalAmount(cart, shippingCostCents, tax);
  // Payee
  const payee = new PayPalPayee(
    process.env.PAYPAL_MERCHANT_EMAIL,
    process.env.PAYPAL_MERCHANT_ID
  );
  const description = `Kickstart Records order #${invoice_id}`;
  const purchaseUnit = new PayPalPurchaseUnit(
    reference_id,
    invoice_id,
    description,
    payPalAmount,
    payee,
    payPalItems
  );
  console.log(`PayPalPurchaseUnit = ${JSON.stringify(purchaseUnit)}`);

  const baseURL = getURL();
  const return_url = `${baseURL}checkout/order-placed`;
  const cancel_url = `${baseURL}checkout/payment`;
  let paymentSource = null;
  if (paymentType === "paypal" || paymentType === "paylater") {
    // payment source
    paymentSource = new PayPalPaymentSource(
      new PayPal(
        new PayPalExperienceContext(GET_FROM_FILE, return_url, cancel_url)
      ),
      null,
      null
    );
  } else if (paymentType === "card") {
    // throw new Error("not implemented yet");
    console.log(`paymentType: ${paymentType}`);
  } else {
    throw new Error(`Invalid payment type: ${paymentType}`);
  }
  // payment source
  // purchaseUnit must be an array.
  const payload = new PayPalOrder([purchaseUnit], paymentSource);
  console.log(
    `serverCreateOrder \n\t PayPal payload = ${JSON.stringify(payload)}`
  );
  const accessToken = await redis.get(PAYPAL_TOKEN);
  const response = await fetch(create_order_endpoint, {
    headers: {
      "Content-Type": "application/json",
      "PayPal-Request-Id": `${reference_id}`,
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  try {
    const result = await handlePayPalResponse(response);
    console.log(`serverCreateOrder -> result = \n\t${JSON.stringify(result)}`);

    return result;
  } catch (err) {
    console.log(`PayPal error: ${err.message}`);
    throw err;
  }
}

async function serverCaptureOrder(payPalOrderId) {
  // Make sure the access_token isn't expired
  await oAuthPayPalRequest();
  const accessToken = await redis.get(PAYPAL_TOKEN);

  try {
    // verify someone hasn't attempted to forge a request
    const matchesPPOrderIdPattern =
      /^[A-Za-z0-9]+$/.test(payPalOrderId) &&
      payPalOrderId.length > 0 &&
      payPalOrderId.length <= 36;
    if (!matchesPPOrderIdPattern) {
      throw new Error(`Invalid PayPal Order ID: ${payPalOrderId}`);
    }
    console.log(`serverCaptureOrder: payPalOrderId = ${payPalOrderId}`);

    const capture_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${payPalOrderId}/capture`;
    console.log(`capture_order_endpoint: ${capture_order_endpoint}`);

    const response = await fetch(capture_order_endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: "{}",
    });
    const { data } = await handlePayPalResponse(response);
    console.log(`serverCaptureOrder -> data = ${JSON.stringify(data)} `);
    const orderId = data.purchase_units[0].reference_id;
    const { invoice_id: orderNumber } =
      data.purchase_units[0].payments.captures[0];
    const { email_address: email } = data.purchase_units[0].shipping;
    // If the user paid with a card, the card name is in payment_source.card.name
    // Otherwise, the name is in purchase_units[0].shipping.name.full_name
    const fullName = data.payment_source.hasOwnProperty("card")
      ? data.payment_source.card.name
      : data.purchase_units[0].shipping.name.full_name;

    await sendOrderEmail(email, orderId, orderNumber, fullName);
    return data;
  } catch (err) {
    console.log(`serverCaptureOrder: ${err}`);
    if (err instanceof ApiError) {
      throw new Error(error.message);
    }
  }
}

async function serverUpdateOrder(sCapturedOrderArgs) {
  console.log(`sCapturedOrderArgs = ${sCapturedOrderArgs}`);
  const coa = JSON.parse(sCapturedOrderArgs);
  const { _paypal_capture_response, _subtotal, _shipping } = coa;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_order", {
    _paypal_capture_response,
    _subtotal,
    _shipping,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `serverUpdateOrder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

async function serverGetOrderDetail(_order_id, _email = null) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_detail", {
    _order_id,
    _email,
  });
  if (error) {
    console.log(`error: ${JSON.stringify(error)}`);
  }
  return { data, error };
}

// Utility functions / API Calls
async function oAuthPayPalRequest() {
  const cacheObj = new CacheObject(
    PAYPAL_TOKEN,
    PAYPAL_TOKEN_ISSUED_AT,
    PAYPAL_TOKEN_EXPIRES_IN
  );
  let tokenExpired = await isCacheItemExpired(cacheObj);
  if (!tokenExpired) return;

  const release = await Mutex.acquire();
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

function getPayPalAmount(cart, shippingCents, taxCents) {
  console.log(
    `getPayPalAmount\n\t${JSON.stringify(
      cart
    )}\n\tshippingCents: ${shippingCents}\n\ttaxCents: ${taxCents}`
  );

  // Shipping and tax must be numbers
  const total = cartTotal(cart);
  const combinedTotal = cartTotal(
    cart,
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
function getPayPalItems(cart, taxPercentageFloat) {
  return cart.map((item) => {
    const category =
      printRecordFormat(cart.recordFormat) === "Download"
        ? DIGITAL_GOODS
        : PHYSICAL_GOODS;

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
      item.count,
      item.description,
      category,
      itemURL,
      item.image.url,
      unit_amount,
      tax_amount,
      item.sku ?? "",
      item.upc ? new PayPalUPC("UPC-A", item.upc) : null
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
      `\n\ntop of sendOrderEmail\n\nemail:${email}\norderNumber:${orderNumber}\fullName:${fullName}`
    );

    const { data, error } = await resend.emails.send({
      from: "Kick Start Records <info@kickstartrecords.com>",
      to: [`${email}`],
      bcc: ["info@kickstartrecords.com"],
      subject: `Kick Start Records Order #${orderNumber}`,
      react: OrderEmailTemplate({ orderNumber, fullName, orderLink }),
    });
    console.log(
      `sendOrderEmail:\n\tdata:\t${JSON.stringify(data)}\n\terror:\t${JSON.stringify(error)}`
    );
  } catch (error) {
    console.log(`error sending order email: ${JSON.stringify(error)}`);
  }
}

async function handlePayPalResponse(response) {
  try {
    const json = await response.json();
    return {
      data: json,
      error: null,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
// Exports
export {
  serverCreateOrder,
  serverCaptureOrder,
  serverUpdateOrder,
  serverGetOrderDetail,
};
