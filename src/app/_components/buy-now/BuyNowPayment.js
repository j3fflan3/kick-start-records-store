"use client";

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
import SpinnerMini from "../spinners/SpinnerMini";
import { useEffect, useState } from "react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useBilling } from "@/src/app/_contexts/BillingProvider";
import { validateEmail } from "@/src/app/_library/utilities";

function BuyNowPayment({
  setPayWith,
  payWith,
  createOrder,
  onApprove,
  onError,
  isPaying,
  setIsPaying,
}) {
  const [cardErrors, setCardErrors] = useState({});
  const [payPalErrors, setPayPalErrors] = useState({});
  const [orderEmail, setOrderEmail] = useState("");

  const {
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
    handlers,
  } = useBilling();
  const {
    handleBillingFirstName,
    handleBillingLastName,
    handleBillingAddress,
    handleBillingAddressContinued,
    handleBillingCity,
    handleBillingStateProvince,
    handleBillingPostalCode,
    handleBillingDestinationCountryCode,
  } = handlers;
  // useEffect(() => {
  //   console.log(`BuyNowPayment -> orderEmail ${orderEmail}`);
  // }, [orderEmail]);
  function handleOrderEmail(e) {
    setPayPalErrors({});
    setOrderEmail(e.target.value);
  }
  const payPalDisabled = !validateEmail(orderEmail);
  function handlePayPalButtonsClick(e) {
    console.log(`handlePayPalButtonsClick fired.`);

    if (!validateEmail(guestEmail)) {
      e.preventDefault();
      setPayPalErrors({ email: "Please enter a valid email address." });
      return false;
    }
  }
  const payPalStyle = { layout: "vertical", disableMaxWidth: true };
  return (
    <div>
      <div className="grid grid-cols-2 mb-2">
        <h1 className="ml-2 mt-1 text-2xl align-baseline text-primary-900">
          {payWith === "card" ? "Card Payment" : "PayPal Payment"}
        </h1>
        <button
          onClick={() => setPayWith("")}
          className="cursor-pointer ml-auto mr-2 outline-1 px-2 py-1 rounded-md outline-primary-400 align-baseline text-primary-900"
        >
          Change payment type&nbsp;
          <ArrowLeftStartOnRectangleIcon className=" size-8 inline-block" />
        </button>
        <div className="col-span-2 my-2 mr-3.25">
          <input
            type="email"
            value={orderEmail}
            onChange={handleOrderEmail}
            placeholder="Email"
            className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
          />
        </div>
      </div>
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
            onClick={handlePayPalButtonsClick}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={payPalStyle}
            disabled={payPalDisabled || isPaying}
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
                  console.log(
                    `PayPalNumberField data: ${JSON.stringify(data)}`
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
                    `PayPalExpiryField data: ${JSON.stringify(data)}`
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
        </div>
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

export default BuyNowPayment;
