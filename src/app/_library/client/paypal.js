"use client";
import { createClient } from "@/src/app/_library/supabase/client";

// Order Related API Calls
async function payPalCreateOrder(createOrderArgs) {
  console.log(`createOrderArgs: ${JSON.stringify(createOrderArgs, null, 2)}`);
  try {
    const response = await fetch("/api/paypal/order/create", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(createOrderArgs),
    });
    const result = await response.json();
    // api response: {data:{...}, error:{...}, status:"n"}
    return result;
  } catch (err) {
    console.log(`create PayPal Order error: ${err.message}`);
    throw err;
  }
}

async function payPalCreateBuyNowOrder(createOrderArgs) {
  console.log(
    `createBuyNowOrderArgs: ${JSON.stringify(createOrderArgs, null, 2)}`
  );
  try {
    const response = await fetch("/api/paypal/buy-now/create", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(createOrderArgs),
    });
    const result = await response.json();
    // api response: {data:{...}, error:{...}, status:"n"}
    return result;
  } catch (err) {
    console.log(`create PayPal Buy Now Order error: ${err.message}`);
    throw err;
  }
}

async function payPalCaptureOrder(payPalOrderId) {
  // Make sure the access_token isn't expired
  try {
    const response = await fetch("/api/paypal/order/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payPalOrderId }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`payPalCaptureOrder: ${err}`);
  }
}

async function payPalUpdateOrder(captureOrderArgs) {
  console.log(
    `captureOrderArgs = ${JSON.stringify(captureOrderArgs, null, 2)}`
  );

  const { _paypal_capture_response, _subtotal, _shipping } = captureOrderArgs;
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
    `payPalUpdateOrder -> {data, error} ${JSON.stringify(
      data,
      null,
      2
    )}, ${JSON.stringify(error, null, 2)}}`
  );
  return { data, error };
}

async function payPalUpdateBuyNowOrder(captureOrderArgs) {
  console.log(
    `sCapturedOrderArgs = ${JSON.stringify(captureOrderArgs, null, 2)}`
  );
  const { _paypal_capture_response, _subtotal } = captureOrderArgs;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_buy_now_order", {
    _paypal_capture_response,
    _subtotal,
  });
  if (error) {
    console.error(error.message);
  }
  console.log(
    `payPalUpdateBuyNowOrder -> {data, error} ${JSON.stringify(
      data,
      null,
      2
    )}, ${JSON.stringify(error, null, 2)}}`
  );
  return { data, error };
}

// Exports
export {
  payPalCaptureOrder,
  payPalCreateOrder,
  payPalCreateBuyNowOrder,
  payPalUpdateOrder,
  payPalUpdateBuyNowOrder,
};
