"use client";
import { createClient } from "@/src/app/_library/supabase/client";

// Order Related API Calls
async function payPalCreateOrder(createOrderArgs) {
  console.log(`createOrderArgs: ${JSON.stringify(createOrderArgs)}`);
  try {
    const response = await fetch("/api/paypal/order/capture", {
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

async function payPalUpdateOrder(sCapturedOrderArgs) {
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
    `payPalUpdateOrder -> {data, error} ${JSON.stringify(
      data
    )}, ${JSON.stringify(error)}}`
  );
  return { data, error };
}

// Exports
export { payPalCaptureOrder, payPalCreateOrder, payPalUpdateOrder };
