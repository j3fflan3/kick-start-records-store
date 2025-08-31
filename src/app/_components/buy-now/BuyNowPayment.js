"use client";

import {
  payPalCaptureOrder,
  payPalCreateBuyNowOrder,
  payPalUpdateBuyNowOrder,
} from "@/src/app/_library/client/paypal";
import { validateEmail } from "@/src/app/_library/utilities";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
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
import { useCallback } from "react";
import SpinnerMini from "../spinners/SpinnerMini";

function BuyNowPayment({
  cardErrors,
  setCardErrors,
  payPalErrors,
  setPayPalErrors,
  setPayWith,
  payWith,
  isPaying,
  setIsPaying,
  billingInfo,
  product,
}) {
  const createOrder = useCallback(
    async (data, actions) => {
      if (!isPaying) setIsPaying(true);
      try {
        const { paymentSource } = data || { paymentSource: "card" };
        if (!validateEmail(billingInfo.orderEmail)) {
          console.log(`invalid email address: ${billingInfo.orderEmail}`);
        }
        console.log(
          `BuyNowCheckout -> createOrder -> data: ${JSON.stringify({ data, actions, billingInfo }, null, 2)} `
        );
        const buyNowOrderArgs = {
          product,
          purchaseEmail: billingInfo.orderEmail,
          taxPercentageFloat: 0,
          paymentSource,
          billingAddress: [
            billingInfo.address,
            billingInfo.addressContinued,
            billingInfo.city,
            billingInfo.stateProvince,
            billingInfo.postalCode,
            billingInfo.destinationCountryCode,
          ],
        };
        console.log(
          `calling payPalCreateBuyNowOrder -> buyNowOrderArgs:\n${JSON.stringify(buyNowOrderArgs, null, 2)}`
        );
        const result = await payPalCreateBuyNowOrder(buyNowOrderArgs);
        console.log(`result: ${JSON.stringify(result, null, 2)}`);

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
            : JSON.stringify(result, null, 2);

          throw new Error(errorMessage);
        }
      } catch (error) {
        setIsPaying(false);
        console.log(`error: ${error}`);
      }
    },
    [billingInfo, isPaying, setIsPaying, product]
  );
  const onApprove = async (data, actions) => {
    console.log(
      `data: ${JSON.stringify(data, null, 2)}, actions: ${JSON.stringify(actions, null, 2)}`
    );

    try {
      const {
        data: order,
        error: captureError,
        status,
      } = await payPalCaptureOrder(data.orderID);
      if (captureError) throw captureError;
      console.log(`order: ${JSON.stringify(order, null, 2)}`);
      const captureOrderArgs = {
        _paypal_capture_response: order,
        _subtotal: Number(subtotal),
        _shipping: Number(shippingCost),
      };
      console.log(
        `BuyNowPayment -> onApprove -> capturedOrderArgs = \n\t${JSON.stringify(capturedOrderArgs, null, 2)}`
      );
      const { data: updateData, error } =
        await payPalUpdateBuyNowOrder(captureOrderArgs);

      if (error) throw error;
      console.log(
        `updateData: ${JSON.stringify(updateData, null, 2)}, error: ${error}`
      );
      // Redirect to order placed page
      const encodedEmail = btoa(order.purchase_units[0].shipping.email_address);
      const orderId = order.purchase_units[0].reference_id;
      router.push(`/checkout/order-placed/${orderId}/${encodedEmail}`);
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error("error capturing order");
    }
  };
  const onError = async (error) => {
    setIsPaying(false);
    console.log(`error: ${error}`);
  };

  const payPalStyle = { layout: "vertical", disableMaxWidth: true };
  return (
    <div className="grid grid-cols-2 mb-2 mt-4">
      <div className="col-span-1">
        <h1 className="ml-2 mt-1 text-2xl align-baseline text-primary-900">
          {payWith === "card" ? "Card Payment" : "PayPal Payment"}
        </h1>
      </div>
      <div className="col-span-1 ml-auto">
        <button
          onClick={() => setPayWith("")}
          className="cursor-pointer mr-2 outline-1 px-2 py-1 rounded-md outline-primary-400 align-baseline text-primary-900"
        >
          Change payment type&nbsp;
          <ArrowLeftStartOnRectangleIcon className=" size-8 inline-block" />
        </button>
      </div>
      <div className="col-span-2 mt-4">
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            currency: "USD",
            intent: "capture",
            components: "card-fields,buttons",
          }}
        >
          <div className={`${payWith === "paypal" ? "" : "hidden"}`}>
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              style={payPalStyle}
              disabled={isPaying}
            />
            <p className="ml-2 mt-2 text-sm text-red-700">
              {payPalErrors?.email && payPalErrors.email}
            </p>
          </div>
          <div className={`${payWith === "card" ? "" : "hidden"}`}>
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
                    console.log(
                      `PayPalNameField data: ${JSON.stringify(data, null, 2)}`
                    ),
                  onFocus: () => setCardErrors({}),
                }}
              />
              <p className="ml-2 mt-2 text-sm text-red-700">
                {cardErrors?.name && cardErrors.name}
              </p>
              <PayPalNumberField
                inputEvents={{
                  onChange: (data) =>
                    console.log(
                      `PayPalNumberField data: ${JSON.stringify(data, null, 2)}`
                    ),
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
                    console.log(
                      `PayPalExpiryField data: ${JSON.stringify(data, null, 2)}`
                    ),
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
                    console.log(
                      `PayPalCVVField data: ${JSON.stringify(data, null, 2)}`
                    ),
                  onFocus: () => setCardErrors({}),
                }}
              />
              <p className="ml-2 mt-2 text-sm text-red-700">
                {cardErrors?.cvv && cardErrors.cvv}
              </p>{" "}
              <div className="ml-1.5 mr-1.5">
                <CheckoutCardSubmit
                  isPaying={isPaying}
                  setIsPaying={setIsPaying}
                  setCardErrors={setCardErrors}
                />
              </div>
            </PayPalCardFieldsProvider>{" "}
          </div>
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
function CheckoutCardSubmit({ isPaying, setIsPaying, setCardErrors, classes }) {
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
      return alert("The card you are using is not eligible for this payment");
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
      className={`w-full block p-3 mt-6 rounded-sm text-lg cursor-pointer font-bold bg-accent-600 text-primary-50 hover:opacity-80 ${classes && classes}`}
    >
      {isPaying ? <SpinnerMini /> : "Pay with Card"}
    </button>
  );
}
export default BuyNowPayment;
