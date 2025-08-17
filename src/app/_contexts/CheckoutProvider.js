"use client";

import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useSession } from "@/src/app/_contexts/SessionProvider";

const CheckoutContext = createContext();
// Utilized for Guest & User Checkout
function CheckoutProvider({ children }) {
  const { session } = useSession();
  // This is always initially null
  const { user } = session || { user: { is_anonymous: true, email: "" } };

  const [errors, setErrors] = useState({});
  const [orderEmail, setOrderEmail] = useState("");
  // const [postalCode, setPostalCode] = useState("");
  // const [destinationCountryCode, setDestinationCountryCode] = useState("US");

  useEffect(() => {
    if (!user.is_anonymous) {
      setOrderEmail(user.email ?? "");
    }
  }, [user]);

  function handleOrderEmail(e) {
    setErrors({});
    setOrderEmail(e.target.value);
  }
  // function handlePostalCode(e) {
  //   setErrors({});
  //   setPostalCode(e.target.value);
  // }
  // function handleDestinationCountryCode(e) {
  //   setErrors({});
  //   setDestinationCountryCode(e.target.value);
  // }

  return (
    <CheckoutContext.Provider
      value={{
        errors,
        orderEmail,
        setErrors,
        handleOrderEmail,
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
