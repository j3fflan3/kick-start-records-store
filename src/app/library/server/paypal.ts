"use server";
import OrderEmailTemplate from "@/src/app/components/email/OrderEmailTemplate";
import {
  DEFAULT_CURRENCY_CODE,
  DIGITAL_GOODS,
  PAYPAL_TOKEN,
  PAYPAL_TOKEN_EXPIRES_IN,
  PAYPAL_TOKEN_ISSUED_AT,
  PayPal,
  type IPayPalExperienceContext,
  PayPalAmount,
  PayPalBreakdown,
  PayPalItem,
  PayPalPaymentSource,
  PayPalSimpleAmount,
  PayPalUPC,
  PHYSICAL_GOODS,
  type ICard,
} from "@/src/app/library/model/paypal";
import {
  getRedis,
  isCacheItemExpired,
  newCacheObject,
} from "@/src/app/library/server/redis";
import { getURL } from "@/src/app/library/server/utilities";
import {
  calculateTax,
  itemsTotal,
  formatDollars,
  type CartItem,
} from "@/src/app/library/utilities";
import { Mutex } from "async-mutex";
import { Resend } from "resend";
import { createClient } from "../supabase/server";

const redis = await getRedis();

// synchronization for Redis reads/writes
const mutex = new Mutex();

async function oAuthPayPalRequest(): Promise<void> {
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
    console.error(`Error retrieving PayPal access token: ${(error as Error).message}`);
  } finally {
    release();
  }
}

function getPayPalAmount(items: CartItem[], shippingCents: number, taxCents: number): PayPalAmount {
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
  const zero = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
  const breakdown = new PayPalBreakdown(
    item_total,
    shipping_total,
    handling_total,
    tax_total,
    zero,
    zero,
    zero
  );

  return new PayPalAmount(DEFAULT_CURRENCY_CODE, combinedTotal, breakdown);
}

interface PayPalCartItem extends CartItem {
  recordFormat: string;
  catalogId: string;
  title: string;
  description: string;
  image: { url: string } | null;
  sku?: string;
  upc?: string;
}

// taxPercentFloat should be either 0, or a float representing a percentage
// e.g, 10.25% would be .1025
function getPayPalItems(items: PayPalCartItem[], taxPercentageFloat: number): PayPalItem[] {
  return items.map((item) => {
    const category =
      item.recordFormat === "Download" ? DIGITAL_GOODS : PHYSICAL_GOODS;

    const unit_amount = new PayPalSimpleAmount(
      DEFAULT_CURRENCY_CODE,
      formatDollars(item.price)
    );

    let tax_amount = new PayPalSimpleAmount(DEFAULT_CURRENCY_CODE, "0.00");
    if (taxPercentageFloat > 0) {
      const tax = calculateTax(taxPercentageFloat, item.price);
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
      String(item?.count ?? 1),
      item.description,
      category,
      itemURL,
      item.image?.url ?? "",
      unit_amount,
      tax_amount,
      item?.sku ?? "",
      item?.upc ? new PayPalUPC("UPC-A", item.upc) : null
    );
  });
}

function getPayPalPaymentSource(paymentType: string, experienceContext: IPayPalExperienceContext | ICard) {
  switch (paymentType) {
    case "paypal":
      return new PayPalPaymentSource(new PayPal(experienceContext as IPayPalExperienceContext), null, null);
    case "card":
      return new PayPalPaymentSource(null, experienceContext as ICard, null);
  }
}

async function sendOrderEmail(email: string, orderId: string, orderNumber: string, fullName: string): Promise<void> {
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

async function sendBuyNowOrderEmail(email: string, orderId: string, orderNumber: string, fullName: string): Promise<void> {
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

async function handlePayPalResponse<T = unknown>(response: Response): Promise<{ data: T; error: null; status: number }> {
  try {
    const json = await response.json() as T;
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

interface OrderImage {
  url: string;
  height: number;
  width: number;
  uom: string;
}

interface OrderDetailItem {
  title: string;
  artist: string | undefined;
  description: string;
  image: OrderImage | null;
  catalogId: string;
  recordFormat: string;
  count: number;
  price: number;
  weight: number;
  sku: string;
  upc: string;
}

interface OrderDetailData {
  order_id: string;
  order_number: string;
  tracking_number: string | null;
  paypal_payment_status: string;
  subtotal: number;
  shipping: number;
  handling: number;
  tax: number;
  orderedDate: string;
  shippedDate: string | null;
  shippingAddress: unknown;
  items: OrderDetailItem[] | null;
}

interface OrderDetailError {
  error: string;
  is_anonymous: boolean;
}

async function getOrderDetail(_order_id: string, _email: string | null = null): Promise<{ data: OrderDetailData | OrderDetailError | null; error: unknown }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const uid = user?.id ?? null;
  const isAnon = user?.is_anonymous ?? false;

  const orConditions: string[] = [];
  if (uid) orConditions.push(`user_id.eq.${uid}`);
  if (_email) orConditions.push(`email.eq.${_email}`);

  if (!orConditions.length) {
    return { data: { error: "couldn't find order", is_anonymous: isAnon }, error: null };
  }

  // Check order exists before fetching full detail
  const { count } = await supabase
    .from("order")
    .select("*", { count: "exact", head: true })
    .or(orConditions.join(","))
    .eq("order_id", _order_id);

  if (!count) {
    return { data: { error: "couldn't find order", is_anonymous: isAnon }, error: null };
  }

  const { data: row, error } = await supabase
    .from("order")
    .select(`
      order_id,
      order_number,
      tracking_number,
      paypal_payment_status,
      subtotal,
      shipping,
      handling,
      tax,
      created,
      fulfilled,
      shipping_address,
      order_catalog_mm(
        count,
        catalog(
          name,
          description,
          catalog_id,
          record_format,
          price,
          weight,
          sku,
          upc,
          artist(name),
          catalog_image_mm(image(uri, file_name, height, width, image_uom))
        )
      )
    `)
    .or(orConditions.join(","))
    .eq("order_id", _order_id)
    .order("created", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    return { data: null, error };
  }

  if (!row) {
    return { data: { error: "couldn't find order", is_anonymous: isAnon }, error: null };
  }

  const items: OrderDetailItem[] | null = (row.order_catalog_mm as any)?.map((item: any) => {
    const c = item.catalog;
    const img = c.catalog_image_mm?.[0]?.image;
    return {
      title: c.name,
      artist: c.artist?.name,
      description: c.description,
      image: img
        ? { url: img.uri + img.file_name, height: img.height, width: img.width, uom: img.image_uom }
        : null,
      catalogId: c.catalog_id,
      recordFormat: c.record_format,
      count: item.count,
      price: c.price,
      weight: c.weight,
      sku: c.sku,
      upc: c.upc,
    };
  }) ?? null;

  return {
    data: {
      order_id: row.order_id,
      order_number: row.order_number,
      tracking_number: row.tracking_number,
      paypal_payment_status: row.paypal_payment_status,
      subtotal: row.subtotal,
      shipping: row.shipping,
      handling: row.handling,
      tax: row.tax,
      orderedDate: row.created,
      shippedDate: row.fulfilled,
      shippingAddress: row.shipping_address,
      items,
    },
    error: null,
  };
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
