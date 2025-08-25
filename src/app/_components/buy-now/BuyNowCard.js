"use client";

import {
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNameField,
  PayPalNumberField,
  PayPalScriptProvider,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import SpinnerMini from "../spinners/SpinnerMini";
import { useState } from "react";

function BuyNowCard({
  createOrder,
  onApprove,
  onError,
  isPaying,
  setIsPaying,
}) {
  const [cardErrors, setCardErrors] = useState({});
  return (
    <div>
      {" "}
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          currency: "USD",
          intent: "capture",
          components: "card-fields",
        }}
      >
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
    </div>
  );
}
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

export default BuyNowCard;
