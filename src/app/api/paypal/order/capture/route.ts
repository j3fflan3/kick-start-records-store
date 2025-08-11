import {
  handlePayPalResponse,
  oAuthPayPalRequest,
  PAYPAL_TOKEN,
  sendOrderEmail,
} from "@/src/app/_library/server/paypal";
import { getRedis } from "@/src/app/_library/server/redis";
import { ApiError } from "@paypal/paypal-server-sdk";

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
      throw new Error(`Invalid PayPal Order ID: ${payPalOrderId}`);
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
    const { data } = await handlePayPalResponse(response);
    console.log(`api/paypal/order/capture -> data = ${JSON.stringify(data)} `);
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
    console.log(`api/paypal/order/capture: ${err}`);
    if (err instanceof ApiError) {
      throw new Error(err.message);
    }
  }
}
