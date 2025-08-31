import {
  Card,
  GET_FROM_FILE,
  PayPal,
  PAYPAL_TOKEN,
  PayPalAddress,
  PayPalExperienceContext,
  PayPalName,
  PayPalOrder,
  PayPalPayee,
  PayPalPaymentSource,
  PayPalPurchaseUnit,
  PayPalShipping,
} from "@/src/app/_library/model/paypal";
import {
  getPayPalAmount,
  getPayPalItems,
  handlePayPalResponse,
  oAuthPayPalRequest,
} from "@/src/app/_library/server/paypal";
import { getRedis } from "@/src/app/_library/server/redis";
import { getURL } from "@/src/app/_library/server/utilities";
import { createClient } from "@/src/app/_library/supabase/server";
import { itemsTax } from "@/src/app/_library/utilities";
import { NextResponse } from "next/server";

const redis = await getRedis();

async function createBuyNowOrderPlaceholder(catalogId: string, email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "create_buy_now_order_placeholder",
    {
      _catalog_id: catalogId,
      _email: email,
    }
  );
  if (error) {
    console.error(error.message);
  }
  console.log(
    `createBuyNowOrderPlaceholder -> {data, error} ${JSON.stringify(
      data,
      null,
      2
    )}, ${JSON.stringify(error, null, 2)}}`
  );
  return { data, error };
}
export async function POST(request: Request) {
  const coa = await request.json();
  console.log(`createOrderArgs: ${JSON.stringify(coa, null, 2)}`);
  const {
    product,
    purchaseEmail: email,
    taxPercentageFloat,
    paymentSource: paymentType,
    billingAddress,
  } = coa;
  const { catalogId } = product;
  const { data, error } = await createBuyNowOrderPlaceholder(catalogId, email);
  if (error) {
    console.log(
      `api/paypal/buy-now/create\n\t${JSON.stringify(error, null, 2)}`
    );
    return NextResponse.json({ error: "Error creating order.", status: 500 });
  }
  const { order_number: invoice_id, order_id: reference_id } = data;
  const create_order_endpoint = `${process.env.PAYPAL_API_URL}/v2/checkout/orders`;
  // extract shipping and billing addressses by position
  const [
    billAddress,
    billAddressContinued,
    billCity,
    billStateProvince,
    billPostalCode,
    billDestinationCountryCode,
  ] = billingAddress;
  // first, items array
  const payPalItems = getPayPalItems([product], taxPercentageFloat);
  console.log(
    `api/paypal/buy-now/create\n\t payPalItems = ${JSON.stringify(payPalItems, null, 2)}`
  );

  // getPayPalAmount
  let tax = 0;
  if (taxPercentageFloat > 0) {
    tax = itemsTax([product], taxPercentageFloat);
    console.log(`tax: ${tax}\n`);
  }
  const payPalAmount = getPayPalAmount([product], 0, tax);
  // Payee
  const payee = new PayPalPayee(
    process.env.PAYPAL_MERCHANT_EMAIL!,
    process.env.PAYPAL_MERCHANT_ID!
  );
  const description = `Kickstart Records order #${invoice_id}`;

  const shippingAdd = new PayPalShipping(
    "PICKUP_FROM_PERSON",
    null,
    email,
    null,
    null
  );
  const purchaseUnit = new PayPalPurchaseUnit(
    reference_id,
    invoice_id,
    description,
    payPalAmount,
    payee,
    payPalItems,
    shippingAdd,
    email
  );
  console.log(`PayPalPurchaseUnit = ${JSON.stringify(purchaseUnit, null, 2)}`);

  const baseURL = getURL();
  const return_url = `${baseURL}checkout/order-placed`;
  const cancel_url = `${baseURL}checkout/payment`;
  let paymentSource = null;

  const payPalBillingAddress = new PayPalAddress(
    billAddress,
    billAddressContinued,
    billCity,
    billStateProvince,
    billPostalCode,
    billDestinationCountryCode
  );

  if (paymentType === "paypal" || paymentType === "paylater") {
    // payment source
    paymentSource = new PayPalPaymentSource(
      new PayPal(
        new PayPalExperienceContext(
          GET_FROM_FILE,
          return_url,
          cancel_url,
          payPalBillingAddress
        )
      ),
      null,
      null
    );
  } else if (paymentType === "card") {
    // throw new Error("not implemented yet");
    console.log(`paymentType: ${paymentType}`);
    paymentSource = new PayPalPaymentSource(
      null,
      new Card(null, null, null, null, payPalBillingAddress),
      null
    );
  } else {
    return NextResponse.json({ error: "Invalid payment type.", status: 400 });
  }
  // payment source
  // purchaseUnit must be an array.
  const payload = new PayPalOrder([purchaseUnit], paymentSource);
  console.log(
    `api/paypal/buy-now/create \n\t PayPal payload = ${JSON.stringify(payload, null, 2)}`
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
      `api/paypal/buy-now/create -> result = \n\t${JSON.stringify(result, null, 2)}`
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
