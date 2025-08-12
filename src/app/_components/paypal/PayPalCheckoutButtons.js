import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import {
  payPalCaptureOrder,
  payPalCreateOrder,
  payPalUpdateOrder,
} from "@/src/app/_library/client/paypal";
import { validateEmail } from "@/src/app/_library/utilities";

const PayPalCheckoutButtons = ({
  orderEmail,
  cart,
  subtotal,
  shippingCost,
  shippingCostCents,
  is_anonymous,
  email,
}) => {
  const [isPaying, setIsPaying] = useState(false);
  const { getShoppingCart } = useShoppingCart();
  const router = useRouter();
  const createOrder = useCallback(
    async function (...payPalArgs) {
      try {
        const [source, order] = payPalArgs;
        const { paymentSource } = source || { paymentSource: "card" };
        let purchaseEmail = is_anonymous ? orderEmail : email;

        console.log(`purchaseEmail: ${purchaseEmail}`);

        if (!validateEmail(purchaseEmail)) {
          const message = `invaid email address: ${purchaseEmail}`;
          console.log(message);

          throw new Error(message);
        }
        console.log(
          "about to call /_library/client/paypal.js -> payPalCreateOrder"
        );
        // Call a server function
        const result = await payPalCreateOrder({
          paymentSource,
          cart,
          purchaseEmail,
          shippingCostCents,
          taxPercentageFloat: 0,
        });
        console.log(`result: ${JSON.stringify(result)}`);
        // console.log(`result.error.message = ${result.error.message}`);

        if (result.error) {
          console.log(`in result.error.message closure`);
          const errMessage = result.error.message;
          throw new Error(errMessage);
        }

        if (result?.data?.id) {
          return result.data.id;
        } else {
          const errorDetail = result?.data?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${result.data.debug_id})`
            : JSON.stringify(result);

          throw new Error(errorMessage);
        }
      } catch (error) {
        console.log(error);

        console.log(`error: ${JSON.stringify(error)}`);
      }
    },
    [orderEmail, cart, email, is_anonymous, shippingCostCents]
  );
  async function onApprove(data, actions) {
    console.log(
      `data: ${JSON.stringify(data)}, actions: ${JSON.stringify(actions)}`
    );

    try {
      const {
        data: order,
        error: captureError,
        status,
      } = await payPalCaptureOrder(data.orderID);
      if (captureError) throw captureError;
      console.log(`order: ${JSON.stringify(order)}`);
      const sCapturedOrderArgs = JSON.stringify({
        _paypal_capture_response: order,
        _subtotal: Number(subtotal),
        _shipping: Number(shippingCost),
      });
      console.log(
        `PayPalCheckoutButtons -> onApprove -> sCapturedOrderArgs = \n\t${sCapturedOrderArgs}`
      );
      const { data: updateData, error } =
        await payPalUpdateOrder(sCapturedOrderArgs);

      if (error) throw error;
      console.log(`updateData: ${JSON.stringify(updateData)}, error: ${error}`);
      // re-retrieve the shopping cart (which should now be empty)
      await getShoppingCart();
      // Redirect to order placed page
      const encodedEmail = btoa(order.purchase_units[0].shipping.email_address);
      const orderId = order.purchase_units[0].reference_id;
      router.push(`/checkout/order-placed/${orderId}/${encodedEmail}`);
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error("error capturing order");
    }
  }
  function onError(err) {
    console.log(`error: ${err}`);

    console.log(`onError called.`);
  }
  const payPalStyle = { layout: "vertical", disableMaxWidth: true };

  return (
    <>
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
    </>
  );
};

export default PayPalCheckoutButtons;
