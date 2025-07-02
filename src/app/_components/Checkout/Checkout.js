"use client";

import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { useShippingCalculator } from "@/src/app/_hooks/useShippingCalculator";
import {
  cartItemsWeight,
  cartTotal,
  validateForm,
} from "@/src/app/_library/utilities";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useRef, useState } from "react";
import { useBilling } from "../../_contexts/BillingProvider";
import { useShipping } from "../../_contexts/ShippingProvider";
import { Address, UserAddress } from "../../_library/address";
import { serverCreateOrder } from "../../_library/serverActions";
import { serverSaveUserAddress } from "@/src/app/_library/settings/serverSettingsActions";
import CheckoutBilling from "./CheckoutBilling";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutAddressList from "@/src/app/_components/checkout/CheckoutAddressList";
import CheckoutTotal from "./CheckoutTotal";

function Checkout({ cart, countries }) {
  // const []
  // use hooks and funcs

  const { session } = useSession();
  const { user } = session;
  console.log(user);
  // State
  const [editAddresses, setEditAddresses] = useState(false);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState("");
  // Instead of destructuring here, destructure in the child component
  // and take only what you need for checkout.js from here.
  const shippingContext = useShipping();
  const {
    errors: shippingErrors,
    setErrors: setShippingErrors,
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  } = shippingContext;
  const shippingReadOnly =
    !editAddresses &&
    firstName &&
    lastName &&
    address &&
    city &&
    stateProvince &&
    postalCode &&
    destinationCountryCode;
  console.log(`shippingReadOnly: ${shippingReadOnly}`);

  // Billing
  const billingContext = useBilling();
  const {
    errors: billingErrors,
    setErrors: setBillingErrors,
    firstName: billingFirstName,
    lastName: billingLastName,
    address: billingAddress,
    addressContinued: billingAddressContinued,
    city: billingCity,
    stateProvince: billingStateProvince,
    postalCode: billingPostalCode,
    destinationCountryCode: billingDestinationCountryCode,
  } = billingContext;
  const billingReadOnly =
    !editAddresses &&
    billingFirstName &&
    billingLastName &&
    billingAddress &&
    billingCity &&
    billingStateProvince &&
    billingPostalCode &&
    billingDestinationCountryCode;
  // functional, email
  const [billingSame, setBillingSame] = useState(true);
  // const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const showPayPalButtons =
    shippingReadOnly &&
    (billingSame || (!billingSame && billingReadOnly)) &&
    !editAddresses;
  console.log(`showPayPalButtons: ${showPayPalButtons}`);

  const [email, setEmail] = useState(user?.user_metadata?.email ?? "");

  // Common
  const emailRef = useRef(null);

  const { cartCount: itemCount } = useShoppingCart();
  const weight = cartItemsWeight(cart);

  const { shippingCost, shippingError } = useShippingCalculator({
    itemCount,
    weight,
    postalCode,
    destinationCountryCode,
  });
  useEffect(
    function () {
      setTotal(cartTotal(cart, shippingCost, tax));
    },
    [shippingCost, cart, tax]
  );
  // For debugging.  Remove when done with this component
  const cartJson = cart ? JSON.stringify(cart) : "";
  console.log(
    `shippingCost: ${shippingCost && shippingCost}, shippingError: ${
      shippingError && shippingError
    }, cartJson: ${cartJson}`
  );

  // Common
  function handleEmail(e) {
    setShippingErrors({});
    setEmail(e.target.value);
  }
  const requiredValidator = (val) => val !== "";

  async function handleNext(e) {
    let validBilling = true; // Placeholder bool
    let validShipping = validateForm(
      setShippingErrors,
      {
        field: "first_name",
        value: firstName,
        validator: requiredValidator,
        message: "First Name is required.",
      },
      {
        field: "last_name",
        value: lastName,
        validator: requiredValidator,
        message: "Last Name is required.",
      },
      {
        field: "address",
        value: address,
        validator: requiredValidator,
        message: "Address is required.",
      },
      {
        field: "city",
        value: city,
        validator: requiredValidator,
        message: "City is required.",
      },
      {
        field: "state_province",
        value: stateProvince,
        validator: requiredValidator,
        message: "State/Province is required.",
      },
      {
        field: "postal_code",
        value: postalCode,
        validator: requiredValidator,
        message: "Postal Code is required.",
      }
    );
    if (!billingSame) {
      //validBilling = validateForm()
      validBilling = validateForm(
        setBillingErrors,
        {
          field: "billing_first_name",
          value: billingFirstName,
          validator: requiredValidator,
          message: "First Name is required.",
        },
        {
          field: "billing_last_name",
          value: billingLastName,
          validator: requiredValidator,
          message: "Last Name is required.",
        },
        {
          field: "billing_address",
          value: billingAddress,
          validator: requiredValidator,
          message: "Address is required.",
        },
        {
          field: "billing_city",
          value: billingCity,
          validator: requiredValidator,
          message: "City is required.",
        },
        {
          field: "billing_state_province",
          value: billingStateProvince,
          validator: requiredValidator,
          message: "State/Province is required.",
        },
        {
          field: "billing_postal_code",
          value: billingPostalCode,
          validator: requiredValidator,
          message: "Postal Code is required.",
        }
      );
    }

    if (validShipping && validBilling) {
      const shippingAdd = new Address(
        address,
        city,
        stateProvince,
        postalCode,
        destinationCountryCode,
        addressContinued,
        firstName,
        lastName
      );
      const billingAdd = billingSame
        ? new Address("", "", "", "", "US", "", "", "")
        : new Address(
            billingAddress,
            billingCity,
            billingStateProvince,
            billingPostalCode,
            billingDestinationCountryCode,
            billingAddressContinued,
            billingFirstName,
            billingLastName
          );
      const userAddress = new UserAddress(
        firstName,
        lastName,
        billingSame,
        shippingAdd,
        billingAdd
      );
      await saveShipping(userAddress);
      setEditAddresses(false);
    }
  }

  const saveShipping = async (userAddress) => {
    const { data, error } = await serverSaveUserAddress(
      JSON.stringify(userAddress)
    );
  };

  const createOrder = async () => {
    try {
      // Call a server function
      await serverCreateOrder(cart, email, shippingCost);
    } catch (error) {}
  };
  function onApprove() {}
  function onError() {}
  const isProcessing = false;

  const payPalStyle = { layout: "vertical", disableMaxWidth: true };
  return (
    <div className="bg-white">
      <h1 className="text-3xl bg-primary-50 pb-4 dark:text-primary-100 text-center dark:bg-primary-950">
        Checkout
      </h1>
      <div className="relative mx-auto grid max-w-7xl dark:bg-primary-950 bg-primary-50 rid-cols-1 gap-x-0 lg:grid-cols-2 lg:px-8 lg:pt-4">
        <CheckoutTotal
          cart={cart}
          total={total}
          tax={tax}
          shippingCost={shippingCost}
        />
        <section
          aria-labelledby="payment-and-shipping-heading"
          className="dark:bg-primary-100 bg-primary-100 py-4 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:px-4 lg:py-4 lg:pb-24 lg:rounded-l-md"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Shipping Info
          </h2>
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            {shippingReadOnly ? (
              <CheckoutAddressList
                billingSame={billingSame}
                setEditAddresses={setEditAddresses}
                title="Shipping Address"
                context={shippingContext}
              />
            ) : (
              <CheckoutShipping
                countries={countries}
                errors={shippingErrors}
                billingSame={billingSame}
                setBillingSame={setBillingSame}
                shippingContext={shippingContext}
              />
            )}
            {billingSame ? (
              ""
            ) : billingReadOnly ? (
              <CheckoutAddressList
                billingSame={null}
                setEditAddresses={setEditAddresses}
                title="Billing Address"
                context={billingContext}
              />
            ) : (
              <CheckoutBilling
                countries={countries}
                errors={billingErrors}
                billingContext={billingContext}
              />
            )}

            <div className="mt-6">
              <label
                htmlFor="email-address"
                className="block text-sm/6 font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email-address"
                  name="email-address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  ref={emailRef}
                  onChange={handleEmail}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
                />
              </div>
            </div>
            {!showPayPalButtons && (
              <div className="mt-6 justify-center w-full flex">
                <button
                  className="text-primary-50 font-bold border border-primary-400 rounded-md px-3 py-2 bg-accent-600 w-full hover:cursor-pointer"
                  onClick={handleNext}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            <div className="mt-10 flex w-full justify-center border-t border-gray-200 pt-6">
              {showPayPalButtons && (
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                    style={payPalStyle}
                    disabled={isProcessing}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
