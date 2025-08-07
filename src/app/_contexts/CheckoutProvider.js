"use client";

import { useContext, useState } from "react";
import { createContext } from "react";

const CheckoutContext = createContext();
// Utilized for Guest Checkout
function CheckoutProvider({ children }) {
  const [errors, setErrors] = useState({});
  const [orderEmail, setOrderEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [destinationCountryCode, setDestinationCountryCode] = useState("US");

  function handleOrderEmail(e) {
    setErrors({});
    setOrderEmail(e.target.value);
  }
  function handlePostalCode(e) {
    setErrors({});
    setPostalCode(e.target.value);
  }
  function handleDestinationCountryCode(e) {
    setErrors({});
    setDestinationCountryCode(e.target.value);
  }

  return (
    <CheckoutContext.Provider
      value={{
        errors,
        orderEmail,
        postalCode,
        destinationCountryCode,
        setErrors,
        handleOrderEmail,
        handlePostalCode,
        handleDestinationCountryCode,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined)
    throw new Error("CheckoutContext used outside of provider");
  return context;
}

export { CheckoutProvider, useCheckout };
