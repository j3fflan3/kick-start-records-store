"use client";

import CheckoutAddressList from "@/src/app/_components/checkout/CheckoutAddressList";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { useShippingCalculator } from "@/src/app/_hooks/useShippingCalculator";
import { serverSaveUserAddress } from "@/src/app/_library/settings/serverSettingsActions";
import {
  cartItemsWeight,
  cartTotal,
  validateEmail,
  validateForm,
} from "@/src/app/_library/utilities";
import {
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalCVVField,
  PayPalExpiryField,
  PayPalNameField,
  PayPalNumberField,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { useBilling } from "../../_contexts/BillingProvider";
import { useShipping } from "../../_contexts/ShippingProvider";
import { Address, UserAddress } from "../../_library/address";
import { PayPalAddress } from "../../_library/paypal";
import { serverCreateOrder } from "../../_library/serverActions";
import CheckoutBilling from "./CheckoutBilling";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutTotal from "./CheckoutTotal";

function Checkout({ cart, countries }) {
  // const []
  // use hooks and funcs

  const { session } = useSession();
  const { user } = session || { user: null };
  console.log(user);
  // State
  const [editAddresses, setEditAddresses] = useState(false);
  const [editShipping, setEditShipping] = useState(false);
  const [editBilling, setEditBilling] = useState(false);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState("");
  // Instead of destructuring here, destructure in the child component
  // and take only what you need for checkout.js from here.
  const shippingContext = useShipping();
  const {
    errors: shippingErrors,
    setErrors: setShippingErrors,
    email,
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
    billingSame,
    setBillingSame,
  } = shippingContext;
  const shippingReadOnly =
    !editShipping &&
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
    !editBilling &&
    billingFirstName &&
    billingLastName &&
    billingAddress &&
    billingCity &&
    billingStateProvince &&
    billingPostalCode &&
    billingDestinationCountryCode;
  // const [showPayPalButtons, setShowPayPalButtons] = useState(false);
  const showPayPalButtons =
    shippingReadOnly &&
    (billingSame || (!billingSame && billingReadOnly)) &&
    !editBilling &&
    !editShipping;
  console.log(`showPayPalButtons: ${showPayPalButtons}`);

  // Because the paypal buttons won't be shown until the address(es) are
  // complete, this state will be up to date, either when the page loads or
  // after HandleNext...
  const [shippingAddress, setShippingAddress] = useState(
    new PayPalAddress(
      address,
      addressContinued,
      city,
      stateProvince,
      postalCode,
      destinationCountryCode
    )
  );
  const [billAddress, setBillAddress] = useState(
    new PayPalAddress(
      billingAddress,
      billingAddressContinued,
      billingCity,
      billingStateProvince,
      billingPostalCode,
      billingDestinationCountryCode
    )
  );

  const { cartCount: itemCount } = useShoppingCart();
  const weight = cartItemsWeight(cart);

  const { shippingCost, shippingCostCents, shippingError } =
    useShippingCalculator({
      itemCount,
      weight,
      postalCode,
      destinationCountryCode,
    });

  useEffect(
    function () {
      setTotal(cartTotal(cart, shippingCostCents, tax));
    },
    [shippingCostCents, cart, tax]
  );
  // For debugging.  Remove when done with this component
  const cartJson = cart ? JSON.stringify(cart) : "";
  console.log(
    `shippingCost: ${shippingCost && shippingCost}, shippingError: ${
      shippingError && shippingError
    }, cartJson: ${cartJson}`
  );

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
      setEditShipping(false);
      setEditBilling(false);
    }
  }

  const saveShipping = async (userAddress) => {
    const { data, error } = await serverSaveUserAddress(
      JSON.stringify(userAddress)
    );
  };

  const createOrder = async (...payPalArgs) => {
    try {
      const [source, order] = payPalArgs;
      const { paymentSource } = source;
      console.log(`payPalArgs = ${JSON.stringify(payPalArgs)}`);
      console.log(`paymentSource: ${JSON.stringify(paymentSource)}`);

      if (!validateEmail(email)) {
        const message = `invaid email address: ${email}`;
        console.log(message);

        throw new Error(message);
      }
      console.log(
        `Checkout.js -> shippingAddress: ${JSON.stringify(
          shippingAddress
        )},\nbillAddress: ${JSON.stringify(billAddress)}`
      );

      // Call a server function
      const result = await serverCreateOrder(
        JSON.stringify({
          cart,
          email,
          shippingCostCents,
          taxPercentageFloat: 0,
          billingSame,
          firstName,
          lastName,
          shippingAddress,
          billingFirstName,
          billingLastName,
          billAddress,
        })
      );
      console.log(`result: ${JSON.stringify(result)}`);
      if (result?.data?.id) {
        return result.data.id;
      } else {
        const errorDetail = result?.data?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${result.data.debug_id})`
          : JSON.stringify(result);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`);
    }
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
                setEditAddresses={setEditShipping}
                title="Shipping"
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
                setEditAddresses={setEditBilling}
                title="Billing"
                context={billingContext}
              />
            ) : (
              <CheckoutBilling
                countries={countries}
                errors={billingErrors}
                billingContext={billingContext}
              />
            )}

            {!showPayPalButtons && (
              <div className="mt-4 justify-center w-full flex">
                <button
                  className="text-primary-50 font-bold border border-primary-400 rounded-md px-3 py-2 bg-accent-600 w-full hover:cursor-pointer"
                  onClick={handleNext}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            <div
              className={`mt-10 flex-row w-full justify-center ${
                showPayPalButtons ? "" : "hidden"
              }`}
            >
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                  currency: "USD",
                  intent: "capture",
                  components: "buttons,card-fields",
                }}
              >
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  style={payPalStyle}
                  disabled={isProcessing}
                />
                <div className="divider">
                  <span>OR</span>
                </div>
                <PayPalCardFieldsProvider
                  createOrder={createOrder}
                  onApprove={onApprove}
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
                    style={{
                      input: { color: "blue" },
                      ".invalid": { color: "purple" },
                    }}
                  />
                  <PayPalNumberField />
                  <PayPalExpiryField />
                  <PayPalCVVField />
                </PayPalCardFieldsProvider>
                <button
                  className="w-full block p-3 mt-6 rounded-sm text-lg cursor-pointer font-bold bg-accent-600 text-primary-50 hover:opacity-80"
                  onClick={() => {
                    createOrder([
                      { paymentSource: "card" },
                      { order: {}, payment: null },
                    ]);
                  }}
                >
                  Pay now with Card
                </button>
              </PayPalScriptProvider>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
