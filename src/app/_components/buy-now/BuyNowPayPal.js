"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

function BuyNowPayPal({
  isPaying,
  setIsPaying,
  createOrder,
  onApprove,
  onError,
}) {
  // Hack: Until I find a proper way otherwise, leaving card-fields in components array so only the
  // PayPal and PayLater buttons appear

  const payPalStyle = { layout: "vertical", disableMaxWidth: true };
  return (
    <div>
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          currency: "USD",
          intent: "capture",
          components: "buttons",
        }}
      >
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={payPalStyle}
          disabled={isPaying}
        />
      </PayPalScriptProvider>
    </div>
  );
}

export default BuyNowPayPal;
