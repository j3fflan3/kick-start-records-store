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
import { useCallback, useState } from "react";
import SpinnerMini from "../spinners/SpinnerMini";
import { validateEmail } from "../../_library/utilities";
import {
  serverCaptureOrder,
  serverCreateOrder,
  serverUpdateOrder,
} from "../../_library/serverActions";
import { useShoppingCart } from "../../_contexts/ShoppingCartProvider";
import { useRouter } from "next/navigation";

const CheckoutPayPal = ({
  guestEmail,
  billAddress,
  billingFirstName,
  billingLastName,
  billingSame,
  cart,
  subtotal,
  shippingAddress,
  shippingCost,
  shippingCostCents,
  is_anonymous,
  email,
  firstName,
  lastName,
}) => {
  console.log(
    `guestEmail = ${guestEmail}, billAddress = ${JSON.stringify(billAddress)}, billingFirstName = ${billingFirstName}, billingLastName = ${billingLastName}, billingSame = ${billingSame}, cart = ${JSON.stringify(cart)}, shippingAddress = ${JSON.stringify(shippingAddress)}, shippingCostCents = ${shippingCostCents}, is_anonymous = ${is_anonymous}, email = ${email}, firstName = ${firstName}, lastName = ${lastName}`
  );

  const [isPaying, setIsPaying] = useState(false);
  const { getShoppingCart } = useShoppingCart();
  const router = useRouter();
  const createOrder = useCallback(
    async function (...payPalArgs) {
      try {
        const [source, order] = payPalArgs;
        const { paymentSource } = source || { paymentSource: "card" };
        let purchaseEmail = is_anonymous ? guestEmail : email;

        console.log(`purchaseEmail: ${purchaseEmail}`);

        if (!validateEmail(purchaseEmail)) {
          const message = `invaid email address: ${purchaseEmail}`;
          console.log(message);

          throw new Error(message);
        }
        console.log(
          `Checkout.js -> shippingAddress: ${JSON.stringify(
            shippingAddress
          )},\nbillAddress: ${JSON.stringify(billAddress)}`
        );

        // Call a server function
        const result = await serverCreateOrder(
          JSON.stringify({
            paymentSource,
            cart,
            purchaseEmail,
            shippingCostCents,
            taxPercentageFloat: 0,
            billingSame,
            firstName,
            lastName,
            shippingAddress,
            billingFirstName,
            billingLastName,
            billAddress,
          })
        );
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
    [
      guestEmail,
      billAddress,
      billingFirstName,
      billingLastName,
      billingSame,
      cart,
      email,
      firstName,
      is_anonymous,
      lastName,
      shippingAddress,
      shippingCostCents,
    ]
  );
  async function onApprove(data, actions) {
    console.log(
      `data: ${JSON.stringify(data)}, actions: ${JSON.stringify(actions)}`
    );

    try {
      const order = await serverCaptureOrder(data.orderID);
      console.log(`order: ${JSON.stringify(order)}`);
      const sCapturedOrderArgs = JSON.stringify({
        _paypal_capture_response: order,
        _subtotal: Number(subtotal),
        _shipping: Number(shippingCost),
      });

      const { data: updateData, error } =
        await serverUpdateOrder(sCapturedOrderArgs);

      if (error) throw error;
      console.log(`updateData: ${updateData}, error: ${error}`);
      // re-retrieve the shopping cart (which should now be empty)
      await getShoppingCart();
      // Redirect to order placed page
      const encodedEmail = btoa(order.purchase_units[0].shipping.email_address);
      const orderId = order.purchase_units[0].reference_id;
      router.push(`/checkout/order-placed/${orderId}/${encodedEmail}`);
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }
  function onError(err) {
    console.log(`error: ${err}`);

    console.log(`onError called.`);
  }
  const payPalStyle = { layout: "vertical", disableMaxWidth: true };

  return (
    <>
      {/* <button
        onClick={() => createOrder({ paymentSource: "card" }, { order: {} })}
      >
        Test
      </button> */}
      {/* NOTE: When the components array for the PayPalScriptProvider options value
              was "buttons,card-fields" (which is what the PayPal example had) the usePayPalCardFields hook returned null,
              but when I reversed them ("card-fields,buttons") it started working 🤷🏼 */}
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
            }}
          />
          <PayPalNumberField
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalNumberField data: ${JSON.stringify(data)}`),
            }}
          />
          <PayPalExpiryField
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalExpiryField data: ${JSON.stringify(data)}`),
            }}
          />
          <PayPalCVVField
            inputEvents={{
              onChange: (data) =>
                console.log(`PayPalCVVField data: ${JSON.stringify(data)}`),
            }}
          />
          <CheckoutCardSubmit isPaying={isPaying} setIsPaying={setIsPaying} />
        </PayPalCardFieldsProvider>
      </PayPalScriptProvider>
    </>
  );
};

function CheckoutCardSubmit({ isPaying, setIsPaying }) {
  const { cardFieldsForm } = usePayPalCardFields();

  // useEffect(() => {
  //   console.log(
  //     `Checkout.js -> cardFieldsForm ${JSON.stringify(cardFieldsForm)}`
  //   );
  //   if (cardFieldsForm) {
  //     console.log(
  //       `Checkout.js -> cardFieldsForm ${JSON.stringify(cardFieldsForm)}`
  //     );
  //   }
  //   if (fields) {
  //     console.log(`Checkout.js -> fields ${JSON.stringify(fields)}`);
  //   }
  // }, [cardFieldsForm, fields]);
  const handleCardPaymentClick = async () => {
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
      return alert("The payment form is invalid");
    }
    setIsPaying(true);

    cardFieldsForm
      .submit()
      .then((data) =>
        console.log(`cardFieldsForm submit-then: ${JSON.stringify(data)} `)
      )
      .catch((err) => {
        console.log(`cardFieldsForm submit-catch: ${err.message}`);

        setIsPaying(false);
      });
  };

  return (
    <button
      type="button"
      onClick={handleCardPaymentClick}
      className="w-full block p-3 mt-6 rounded-sm text-lg cursor-pointer font-bold bg-accent-600 text-primary-50 hover:opacity-80"
    >
      {isPaying ? <SpinnerMini /> : "Pay with Card"}
    </button>
  );
}

export default CheckoutPayPal;
