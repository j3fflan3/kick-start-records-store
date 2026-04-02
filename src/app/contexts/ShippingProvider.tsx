// Not currently used.  Leaving for future use.
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "./SessionProvider";

interface ShippingHandlers {
  handleFirstName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLastName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressContinued: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStateProvince: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostalCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDestinationCountryCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ShippingContextType {
  errors: Record<string, string>;
  firstName: string;
  lastName: string;
  address: string;
  addressContinued: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  destinationCountryCode: string;
  billingSame: boolean;
  setBillingSame: React.Dispatch<React.SetStateAction<boolean>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setDestinationCountryCode: React.Dispatch<React.SetStateAction<string>>;
  handlers: ShippingHandlers;
  firstNameRef: React.RefObject<HTMLInputElement | null>;
  lastNameRef: React.RefObject<HTMLInputElement | null>;
  addressRef: React.RefObject<HTMLInputElement | null>;
  addressContinuedRef: React.RefObject<HTMLInputElement | null>;
  cityRef: React.RefObject<HTMLInputElement | null>;
  stateProvinceRef: React.RefObject<HTMLInputElement | null>;
  postalCodeRef: React.RefObject<HTMLInputElement | null>;
  destinationCountryCodeRef: React.RefObject<HTMLInputElement | null>;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

function ShippingProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  // This is always initially null
  const { user } = session || { user: null };

  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const addressContinuedRef = useRef<HTMLInputElement | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const stateProvinceRef = useRef<HTMLInputElement | null>(null);
  const postalCodeRef = useRef<HTMLInputElement | null>(null);
  const destinationCountryCodeRef = useRef<HTMLInputElement | null>(null);
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setFirstName(e.target.value);
  };
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setLastName(e.target.value);
  };
  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setAddress(e.target.value);
  };
  const handleAddressContinued = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setAddressContinued(e.target.value);
  };
  const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setCity(e.target.value);
  };
  const handleStateProvince = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setStateProvince(e.target.value);
  };
  const handlePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setPostalCode(e.target.value);
  };
  const handleDestinationCountryCode = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setDestinationCountryCode,
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
