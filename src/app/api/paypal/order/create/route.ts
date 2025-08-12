import { NextResponse } from "next/server";
import { createClient } from "@/src/app/_library/supabase/server";
import {
  getPayPalAmount,
  getPayPalItems,
  handlePayPalResponse,
  oAuthPayPalRequest,
  PAYPAL_TOKEN,
} from "@/src/app/_library/server/paypal";
import { cartTax } from "@/src/app/_library/utilities";
import {
  GET_FROM_FILE,
  PayPal,
  PayPalExperienceContext,
  PayPalOrder,
  PayPalPayee,
  PayPalPaymentSource,
  PayPalPurchaseUnit,
} from "@/src/app/_library/model/paypal";
import { getURL } from "@/src/app/_library/server/utilities";
import { getRedis } from "@/src/app/_library/server/redis";

const redis = await getRedis();

async function createOrderPlaceholder(shoppingCartId: string, email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order_placeholder", {
    _shopping_cart_id: shoppingCartId,
    _email: email,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `createOrderPlaceholder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

export async function POST(request: Request) {
  const coa = await request.json();
  console.log(`createOrderArgs: ${JSON.stringify(coa)}`);
  const {
    cart,
    purchaseEmail: email,
    shippingCostCents,
    taxPercentageFloat,
    paymentSource: paymentType,
  } = coa;
  const { shopping_cart_id: shoppingCartId } = cart[0];
  const { data, error } = await createOrderPlaceholder(shoppingCartId, email);
  if (error) throw new Error(error.message);
  const { order_number: invoice_id, order_id: reference_id } = data;

  const create_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
  // first, items array
  const payPalItems = getPayPalItems(cart, taxPercentageFloat);
  console.log(
    `api/paypal/order/create\n\t payPalItems = ${JSON.stringify(payPalItems)}`
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
    process.env.PAYPAL_MERCHANT_EMAIL!,
    process.env.PAYPAL_MERCHANT_ID!
  );
  const description = `Kickstart Records order #${invoice_id}`;
  const purchaseUnit = new PayPalPurchaseUnit(
    reference_id,
    invoice_id,
    description,
    payPalAmount,
    payee,
    payPalItems,
    null
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
        new PayPalExperienceContext(GET_FROM_FILE, return_url, cancel_url, null)
      ),
      null,
      null
    );
  } else if (paymentType === "card") {
    // throw new Error("not implemented yet");
    console.log(`paymentType: ${paymentType}`);
  } else {
    return NextResponse.json({ error: "Invalid payment type.", status: 400 });
  }
  // payment source
  // purchaseUnit must be an array.
  const payload = new PayPalOrder([purchaseUnit], paymentSource);
  console.log(
    `api/paypal/order/create \n\t PayPal payload = ${JSON.stringify(payload)}`
  );
  // Make sure the access_token isn't expired
  await oAuthPayPalRequest();
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
    console.log(
      `api/paypal/order/create -> result = \n\t${JSON.stringify(result)}`
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.log(`PayPal error: ${err}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
