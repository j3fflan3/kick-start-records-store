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
import { useEffect, useRef, useState } from "react";
import { useBilling } from "../../_contexts/BillingProvider";
import { useShipping } from "../../_contexts/ShippingProvider";
import { Address, UserAddress } from "../../_library/address";
import { PayPalAddress } from "../../_library/paypal";
import {
  serverCaptureOrder,
  serverCreateOrder,
  serverUpdateOrder,
} from "../../_library/serverActions";
import CheckoutBilling from "./CheckoutBilling";
import CheckoutShipping from "./CheckoutShipping";
import CheckoutTotal from "./CheckoutTotal";
import { useRouter } from "next/navigation";

function Checkout({ cart, countries }) {
  // Checkout will always have a cart of at least one item.  All items will have the same
  // shopping_cart_id
  const { shopping_cart_id: shoppingCartId } = cart[0];
  const router = useRouter();
  // use hooks and funcs
  const { session } = useSession();
  const { user } = session || { user: null };
  console.log(user);
  // State
  const [editAddresses, setEditAddresses] = useState(false);
  const [editShipping, setEditShipping] = useState(false);
  const [editBilling, setEditBilling] = useState(false);
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");
  const [anonEmail, setAnonEmail] = useState("");
  const [anonEmailError, setAnonEmailError] = useState({});
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
  let showPayPalButtons =
    shippingReadOnly &&
    (billingSame || (!billingSame && billingReadOnly)) &&
    !editBilling &&
    (!user.is_anonymous || (user.is_anonymous && anonEmail)) &&
    !editShipping;
  if (user.is_anonymous) {
    // If the user is anonymous, we need to show the email field
    showPayPalButtons = showPayPalButtons && anonEmail;
  }

  // console.log(`showPayPalButtons: ${showPayPalButtons}`);

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

  useEffect(() => {
    console.log(`Checkout.js -> shippingAddress useEffect called`);

    setShippingAddress(
      new PayPalAddress(
        address,
        addressContinued,
        city,
        stateProvince,
        postalCode,
        destinationCountryCode
      )
    );
  }, [
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  ]);

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

  useEffect(() => {
    console.log(`Checkout.js -> billAddress useEffect called`);

    setBillAddress(
      new PayPalAddress(
        billingAddress,
        billingAddressContinued,
        billingCity,
        billingStateProvince,
        billingPostalCode,
        billingDestinationCountryCode
      )
    );
  }, [
    billingAddress,
    billingAddressContinued,
    billingCity,
    billingStateProvince,
    billingPostalCode,
    billingDestinationCountryCode,
  ]);

  const { cartCount: itemCount, getShoppingCart } = useShoppingCart();
  const weight = cartItemsWeight(cart);

  const { shippingCost, shippingCostCents, shippingError } =
    useShippingCalculator({
      itemCount,
      weight,
      postalCode,
      destinationCountryCode,
    });
  const anonEmailRef = useRef(null);
  useEffect(
    function () {
      setSubtotal(cartTotal(cart));
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
    let validEmail = !user.is_anonymous;
    if (user.is_anonymous) {
      // If the user is anonymous, we need to set the email address
      validEmail = validateForm(setAnonEmailError, {
        field: "anon_email",
        value: anonEmail,
        validator: validateEmail,
        message: "Email is invalid/required.",
      });
    }
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

    if (validShipping && validBilling && validEmail) {
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
      if (!user.id_anonymous) await saveShipping(userAddress);
      setEditShipping(false);
      setEditBilling(false);
    }
  }
  // This should only be called for signed up users, not anonymous users
  // See example in handleNext
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
      let purchaseEmail = user.is_anonymous ? anonEmail : email;
      if (!validateEmail(purchaseEmail)) {
        const message = `invaid email address: ${purchaseEmail}`;
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
          purchaseEmail,
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
      // console.log(`result.error.message = ${result.error.message}`);

      if (result.error) {
        console.log(`in result.error.message closure`);
        const errMessage = result.error.message;
        throw new Error(errMessage);
      }

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
      console.log(error);

      console.log(`error: ${JSON.stringify(error)}`);
    }
  };
  async function onApprove(data, actions) {
    console.log(
      `data: ${JSON.stringify(data)}, actions: ${JSON.stringify(actions)}`
    );

    try {
      const order = await serverCaptureOrder(data.orderID);
      console.log(`order: ${JSON.stringify(order)}`);
      const sCapturedOrderArgs = JSON.stringify({
        _paypal_capture_response: order,
        _subtotal: Number(subtotal),
        _shipping: Number(shippingCost),
      });
      const { data: updateData, error } =
        await serverUpdateOrder(sCapturedOrderArgs);
      if (error) throw error;
      console.log(`updateData: ${updateData}, error: ${error}`);
      // re-retrieve the shopping cart (which should now be empty)
      await getShoppingCart();
      // Redirect to order placed page
      const encodedEmail = btoa(order.purchase_units[0].shipping.email_address);
      console.log(
        `encodedEmail: ${encodedEmail}, email ${order.purchase_units[0].shipping.email_address}`
      );
      const orderId = order.purchase_units[0].reference_id;
      router.push(`/checkout/order-placed/${orderId}/${encodedEmail}`);
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }
  function onError(err) {
    console.log(`error: ${err}`);

    console.log(`onError called.`);
  }
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
            {user.is_anonymous && !showPayPalButtons && (
              <div className="mt-6">
                <label
                  htmlFor="first_name"
                  className=" text-sm/6 font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="anon_email"
                    placeholder=""
                    className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                    value={anonEmail}
                    ref={anonEmailRef}
                    onChange={(e) => setAnonEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="ml-2 mt-2 text-sm text-red-700">
                  {anonEmailError?.anon_email && anonEmailError.anon_email}
                </p>
              </div>
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
