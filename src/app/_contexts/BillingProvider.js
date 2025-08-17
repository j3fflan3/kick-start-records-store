// Not currently used.  Leaving for possible future use
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "./SessionProvider";

const BillingContext = createContext();

function BillingProvider({ children }) {
  const { session } = useSession();
  // console.log(
  //   `BillingProvider -> session = ${
  //     session ? JSON.stringify(session) : session
  //   }`
  // );
  // This is always initially null
  const { user } = session || { user: null };

  // Will these ever be valid when it first loads?
  const [errors, setErrors] = useState({});
  const [guestEmail, setGuestEmail] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [addressContinued, setAddressContinued] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [destinationCountryCode, setDestinationCountryCode] = useState("US");
  // Create refs for each state variable
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const addressRef = useRef(null);
  const addressContinuedRef = useRef(null);
  const cityRef = useRef(null);
  const stateProvinceRef = useRef(null);
  const postalCodeRef = useRef(null);
  const destinationCountryCodeRef = useRef(null);
  // Handler functions for each useState variable (excluding errors)
  const handleGuestEmail = (e) => {
    setErrors({});
    setGuestEmail(e.target.value);
  };
  const handleBillingFirstName = (e) => {
    setErrors({});
    setFirstName(e.target.value);
  };
  const handleBillingLastName = (e) => {
    setErrors({});
    setLastName(e.target.value);
  };
  const handleBillingAddress = (e) => {
    setErrors({});
    setAddress(e.target.value);
  };
  const handleBillingAddressContinued = (e) => {
    setErrors({});
    setAddressContinued(e.target.value);
  };
  const handleBillingCity = (e) => {
    setErrors({});
    setCity(e.target.value);
  };
  const handleBillingStateProvince = (e) => {
    setErrors({});
    setStateProvince(e.target.value);
  };
  const handleBillingPostalCode = (e) => {
    setErrors({});
    setPostalCode(e.target.value);
  };
  const handleBillingDestinationCountryCode = (e) => {
    setErrors({});
    setDestinationCountryCode(e.target.value);
  };

  // When NEXT first loads this provider, session is null, so we want
  // to set the state values when session (and therefore user) is not null.
  useEffect(() => {
    if (user?.user_metadata?.billingSameAsShipping ?? false) {
      setInitialized(true);
    }

    if (initialized) return;

    if ((user?.user_metadata?.billingAddress?.address ?? "") && !initialized) {
      setFirstName(user?.user_metadata?.firstName ?? "");
      setLastName(user?.user_metadata?.lastName ?? "");
      setAddress(user?.user_metadata?.billingAddress?.address ?? "");
      setAddressContinued(
        user?.user_metadata?.billingAddress?.addressContinued ?? ""
      );
      setCity(user?.user_metadata?.billingAddress?.city ?? "");
      setStateProvince(
        user?.user_metadata?.billingAddress?.stateProvince ?? ""
      );
      setPostalCode(user?.user_metadata?.billingAddress?.postalCode ?? "");
      setDestinationCountryCode(
        user?.user_metadata?.billingAddress?.destinationCountryCode ?? "US"
      );
      setInitialized(true);
    }
  }, [
    user,
    initialized,
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  ]);

  return (
    <BillingContext.Provider
      value={{
        errors,
        setErrors,
        guestEmail,
        setGuestEmail,
        firstName,
        lastName,
        address,
        addressContinued,
        city,
        stateProvince,
        postalCode,
        destinationCountryCode,
        // Handler functions
        handlers: {
          handleBillingFirstName,
          handleBillingLastName,
          handleBillingAddress,
          handleBillingAddressContinued,
          handleBillingCity,
          handleBillingStateProvince,
          handleBillingPostalCode,
          handleBillingDestinationCountryCode,
        },
        // Expose refs
        firstNameRef,
        lastNameRef,
        addressRef,
        addressContinuedRef,
        cityRef,
        stateProvinceRef,
        postalCodeRef,
        destinationCountryCodeRef,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}
function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined)
    throw new Error("BillingContext used outside of provider");
  return context;
}
export { BillingProvider, useBilling };
