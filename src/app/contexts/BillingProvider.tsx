// Not currently used.  Leaving for possible future use
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "./SessionProvider";

interface BillingHandlers {
  handleBillingFirstName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingLastName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingAddressContinued: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingCity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingStateProvince: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingPostalCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingDestinationCountryCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface BillingContextType {
  errors: Record<string, string>;
  billingEmail: string;
  firstName: string;
  lastName: string;
  address: string;
  addressContinued: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  destinationCountryCode: string;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setBillingEmail: React.Dispatch<React.SetStateAction<string>>;
  setDestinationCountryCode: React.Dispatch<React.SetStateAction<string>>;
  handlers: BillingHandlers;
  firstNameRef: React.RefObject<HTMLInputElement | null>;
  lastNameRef: React.RefObject<HTMLInputElement | null>;
  addressRef: React.RefObject<HTMLInputElement | null>;
  addressContinuedRef: React.RefObject<HTMLInputElement | null>;
  cityRef: React.RefObject<HTMLInputElement | null>;
  stateProvinceRef: React.RefObject<HTMLInputElement | null>;
  postalCodeRef: React.RefObject<HTMLInputElement | null>;
  destinationCountryCodeRef: React.RefObject<HTMLInputElement | null>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

function BillingProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  // console.log(
  //   `BillingProvider -> session = ${
  //     session ? JSON.stringify(session) : session
  //   }`
  // );
  // This is always initially null
  const { user } = session || { user: null };

  // Will these ever be valid when it first loads?
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billingEmail, setBillingEmail] = useState("");
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
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const addressContinuedRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const stateProvinceRef = useRef<HTMLInputElement | null>(null);
  const postalCodeRef = useRef<HTMLInputElement | null>(null);
  const destinationCountryCodeRef = useRef<HTMLInputElement | null>(null);
  // Handler functions for each useState variable (excluding errors)
  const handleBillingEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setBillingEmail(e.target.value);
  };
  const handleBillingFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setFirstName(e.target.value);
  };
  const handleBillingLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setLastName(e.target.value);
  };
  const handleBillingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setAddress(e.target.value);
  };
  const handleBillingAddressContinued = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setAddressContinued(e.target.value);
  };
  const handleBillingCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setCity(e.target.value);
  };
  const handleBillingStateProvince = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setStateProvince(e.target.value);
  };
  const handleBillingPostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setPostalCode(e.target.value);
  };
  const handleBillingDestinationCountryCode = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        billingEmail,
        firstName,
        lastName,
        address,
        addressContinued,
        city,
        stateProvince,
        postalCode,
        destinationCountryCode,
        // setters
        setErrors,
        setBillingEmail,
        setDestinationCountryCode,
        // Handler functions
        handlers: {
          handleBillingFirstName,
          handleBillingLastName,
          handleBillingEmail,
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
