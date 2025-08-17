import {
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNameField,
  PayPalNumberField,
  PayPalScriptProvider,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import {
  payPalCaptureOrder,
  payPalCreateOrder,
  payPalUpdateOrder,
} from "@/src/app/_library/client/paypal";
import { validateEmail } from "@/src/app/_library/utilities";
import SpinnerMini from "../spinners/SpinnerMini";

const PayPalCheckoutButtons = ({
  isPaying,
  setIsPaying,
  orderEmail,
  cart,
  subtotal,
  shippingCost,
  shippingCostCents,
  shippingAddress,
  billingAddress,
  is_anonymous,
  email,
}) => {
  const [cardErrors, setCardErrors] = useState({});
  const { getShoppingCart } = useShoppingCart();
  const router = useRouter();
  const createOrder = useCallback(
    async function (...payPalArgs) {
      if (!isPaying) setIsPaying(true);
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
          shippingAddress,
          billingAddress,
        });
        console.log(`result: ${JSON.stringify(result, null, "\t")}`);
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
        setIsPaying(false);
        console.log(error);

        console.log(`error: ${JSON.stringify(error)}`);
      }
    },
    [
      orderEmail,
      cart,
      email,
      is_anonymous,
      shippingCostCents,
      shippingAddress,
      billingAddress,
      setIsPaying,
      isPaying,
    ]
  );
  async function onApprove(data, actions) {
    console.log(
      `data: ${JSON.stringify(data, null, "\t")}, actions: ${JSON.stringify(actions)}`
    );

    try {
      const {
        data: order,
        error: captureError,
        status,
      } = await payPalCaptureOrder(data.orderID);
      if (captureError) throw captureError;
      console.log(`order: ${JSON.stringify(order, null, "\t")}`);
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
      console.log(
        `updateData: ${JSON.stringify(updateData, null, "\t")}, error: ${error}`
      );
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
    setIsPaying(false);
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
          components: "card-fields,buttons",
        }}
      >
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={payPalStyle}
          disabled={isPaying}
        />
        <div className="divider">
          <span>OR</span>
        </div>
        <PayPalCardFieldsProvider
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            input: {
              "font-size": "16px",
              "font-family": "courier, monospace",
              "font-weight": "lighter",
              color: "#ccc",
            },
            ".invalid": { color: "purple" },
          }}
        >
          <PayPalNameField
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalNameField data: ${JSON.stringify(data)}`),
              onFocus: () => setCardErrors({}),
            }}
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {cardErrors?.name && cardErrors.name}
          </p>
          <PayPalNumberField
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalNumberField data: ${JSON.stringify(data)}`),
              onFocus: () => setCardErrors({}),
            }}
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {cardErrors?.number && cardErrors.number}
          </p>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {cardErrors?.ineligible_card_vendor &&
              cardErrors.ineligible_card_vendor}
          </p>
          <PayPalExpiryField
            onFocus={() => setCardErrors({})}
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalExpiryField data: ${JSON.stringify(data)}`),
              onFocus: () => setCardErrors({}),
            }}
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {cardErrors?.expiry && cardErrors.expiry}
          </p>{" "}
          <PayPalCVVField
            onFocus={() => setCardErrors({})}
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalCVVField data: ${JSON.stringify(data)}`),
              onFocus: () => setCardErrors({}),
            }}
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {cardErrors?.cvv && cardErrors.cvv}
          </p>{" "}
          <CheckoutCardSubmit
            isPaying={isPaying}
            setIsPaying={setIsPaying}
            setCardErrors={setCardErrors}
          />
        </PayPalCardFieldsProvider>
      </PayPalScriptProvider>
    </>
  );
};
function CheckoutCardSubmit({ isPaying, setIsPaying, setCardErrors }) {
  const { cardFieldsForm } = usePayPalCardFields();

  function parseCardErrors(errors) {
    const cardErrors = {};
    for (const error of errors) {
      switch (error) {
        case "INELIGIBLE_CARD_VENDOR":
          cardErrors["ineligible_card_vendor"] =
            "Ineligible card vendor. Please use a different form of payment.";
          break;
        case "INVALID_NAME":
          cardErrors["name"] = "Invalid name.";
          break;
        case "INVALID_NUMBER":
          cardErrors["number"] = "Invalid card number.";
          break;
        case "INVALID_EXPIRY":
          cardErrors["expiry"] = "Invalid card expiry.";
          break;
        case "INVALID_CVV":
          cardErrors["cvv"] = "Invalid card CVV.";
          break;
        default:
        // do nothing
      }
    }
    setCardErrors(cardErrors);
  }

  const handleCardPaymentClick = async (e) => {
    if (!cardFieldsForm) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalCardFieldsProvider />";

      throw new Error(childErrorMessage);
    }
    if (!cardFieldsForm.isEligible()) {
      return alert("The card you are using is not eligible for this action");
    }
    const formState = await cardFieldsForm.getState();

    if (!formState.isFormValid) {
      // INVALID_NUMBER,INVALID_EXPIRY,INVALID_CVV
      console.log(`CheckoutCardSubmit -> formState.errors ${formState.errors}`);
      parseCardErrors(formState.errors);
      setIsPaying(false);
      return;
    }
    cardFieldsForm.submit().catch((err) => {
      console.log(`cardFieldsForm submit-catch: ${err.message}`);
    });
  };

  return (
    <button
      type="button"
      onClick={() => {
        setIsPaying(true);
        handleCardPaymentClick();
      }}
      className="w-full block p-3 mt-6 rounded-sm text-lg cursor-pointer font-bold bg-accent-600 text-primary-50 hover:opacity-80"
    >
      {isPaying ? <SpinnerMini /> : "Pay with Card"}
    </button>
  );
}

export default PayPalCheckoutButtons;
