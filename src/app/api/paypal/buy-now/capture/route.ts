import { PAYPAL_TOKEN, type PayPalCaptureResponse } from "@/src/app/library/model/paypal";
import {
  handlePayPalResponse,
  oAuthPayPalRequest,
  sendOrderEmail,
} from "@/src/app/library/server/paypal";
import { getRedis } from "@/src/app/library/server/redis";
import { NextResponse } from "next/server";

const redis = await getRedis();

export async function POST(request: Request) {
  const { payPalOrderId } = await request.json();
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
      return NextResponse.json({
        error: "Invalid PayPal Order ID.",
        status: 400,
      });
    }
    console.log(`api/paypal/order/capture: payPalOrderId = ${payPalOrderId}`);

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
    const paypalResponse = await handlePayPalResponse<PayPalCaptureResponse>(response);
    const { data } = paypalResponse;
    console.log(
      `api/paypal/order/capture -> data = ${JSON.stringify(data, null, 2)} `
    );
    const orderId = data.purchase_units[0].reference_id;
    const { invoice_id: orderNumber } =
      data.purchase_units[0].payments.captures[0];
    const email = data.purchase_units[0].payments.captures[0].custom_id;
    const fullName = data.payment_source.card?.name ?? "";

    console.log(`api/paypal/order/capture -> fullName=${fullName}`);
    await sendOrderEmail(email, orderId, orderNumber, fullName);
    return NextResponse.json(paypalResponse);
  } catch (err) {
    console.log(`api/paypal/order/capture: ${err}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
