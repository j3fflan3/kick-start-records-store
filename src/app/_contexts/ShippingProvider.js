// Not currently used.  Leaving for future use.
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "./SessionProvider";

const ShippingContext = createContext();

function ShippingProvider({ children }) {
  const { session } = useSession();
  // This is always initially null
  const { user } = session || { user: null };

  const [errors, setErrors] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [addressContinued, setAddressContinued] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [destinationCountryCode, setDestinationCountryCode] = useState("US");
  const [billingSame, setBillingSame] = useState(true);
  // Create refs for each state variable
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const addressRef = useRef(null);
  const addressContinuedRef = useRef(null);
  const cityRef = useRef(null);
  const stateProvinceRef = useRef(null);
  const postalCodeRef = useRef(null);
  const destinationCountryCodeRef = useRef(null);
  const handleFirstName = (e) => {
    setErrors({});
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setErrors({});
    setLastName(e.target.value);
  };
  const handleAddress = (e) => {
    setErrors({});
    setAddress(e.target.value);
  };
  const handleAddressContinued = (e) => {
    setErrors({});
    setAddressContinued(e.target.value);
  };
  const handleCity = (e) => {
    setErrors({});
    setCity(e.target.value);
  };
  const handleStateProvince = (e) => {
    setErrors({});
    setStateProvince(e.target.value);
  };
  const handlePostalCode = (e) => {
    setErrors({});
    setPostalCode(e.target.value);
  };
  const handleDestinationCountryCode = (e) => {
    setErrors({});
    setDestinationCountryCode(e.target.value);
  };
  // When NEXT first loads this provider, session is null, so we want
  // to set the state values when session (and therefore user) is not null.
  useEffect(() => {
    if ((user?.user_metadata?.shippingAddress?.address ?? "") && !initialized) {
      // console.log(
      //   `inside Shipping Provider useEffect: user_metadata:${JSON.stringify(
      //     user.user_metadata
      //   )}`
      // );
      setFirstName(user?.user_metadata?.firstName ?? "");
      setLastName(user?.user_metadata?.lastName ?? "");
      setAddress(user?.user_metadata?.shippingAddress?.address ?? "");
      setAddressContinued(
        user?.user_metadata?.shippingAddress?.addressContinued ?? ""
      );
      setCity(user?.user_metadata?.shippingAddress?.city ?? "");
      setStateProvince(
        user?.user_metadata?.shippingAddress?.stateProvince ?? ""
      );
      setPostalCode(user?.user_metadata?.shippingAddress?.postalCode ?? "");
      setDestinationCountryCode(
        user?.user_metadata?.shippingAddress?.destinationCountryCode ?? ""
      );

      setBillingSame(user?.user_metadata?.billingSameAsShipping ?? true);
      console.log(
        `ShippingProvider -> billingSame = ${user?.user_metadata?.billingSameAsShipping}`
      );
      setInitialized(true);
    }
  }, [user, initialized]);

  return (
    <ShippingContext.Provider
      value={{
        errors,
        firstName,
        lastName,
        address,
        addressContinued,
        city,
        stateProvince,
        postalCode,
        destinationCountryCode,
        billingSame,
        // Setters
        setBillingSame,
        setErrors,
        // Handler functions
        handlers: {
          handleFirstName,
          handleLastName,
          handleAddress,
          handleAddressContinued,
          handleCity,
          handleStateProvince,
          handlePostalCode,
          handleDestinationCountryCode,
        },
        // Optionally, you can expose the refs if needed:
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
    </ShippingContext.Provider>
  );
}
function useShipping() {
  const context = useContext(ShippingContext);
  if (context === undefined)
    throw new Error("ShippingContext used outside of provider");
  return context;
}
export { ShippingProvider, useShipping };
