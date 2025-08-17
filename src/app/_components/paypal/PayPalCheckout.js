"use client";

// import CardCheckoutButton from "@/src/app/_components/checkout/CardCheckoutButton";
import PayPalCheckoutButtons from "@/src/app/_components/paypal/PayPalCheckoutButtons";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { useShippingCalculator } from "@/src/app/_hooks/useShippingCalculator";
import {
  cartItemsWeight,
  cartTotal,
  validateEmail,
  validateForm,
} from "@/src/app/_library/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useCheckout,
  useGuestEmail,
} from "@/src/app/_contexts/CheckoutProvider";
import PayPalCheckoutTotal from "./PayPalCheckoutTotal";
import PayPalCheckoutShipping from "@/src/app/_components/paypal/PayPalCheckoutShipping";
import PayPalCheckoutBilling from "@/src/app/_components/paypal/PayPalCheckoutBilling";
import PayPalCheckoutAddressList from "@/src/app/_components/paypal/PayPalCheckoutAddressList";
import { useShipping } from "@/src/app/_contexts/ShippingProvider";
import { useBilling } from "@/src/app/_contexts/BillingProvider";
import { PayPalAddress } from "@/src/app/_library/model/paypal";
import { serverSaveUserAddress } from "@/src/app/_library/settings/serverSettingsActions";
import { Address, UserAddress } from "@/src/app/_library/model/address";
import Spinner from "../spinners/Spinner";

function PayPalCheckout({ cart, countries }) {
  // State & Hooks
  // Checkout will always have a cart of at least one item.  All items will have the same
  const router = useRouter();
  // use hooks and funcs
  const { session } = useSession();
  const { user } = session || { user: null };
  console.log(user);
  const {
    errors: orderEmailErrors,
    setErrors: setOrderEmailErrors,
    orderEmail,
    handleOrderEmail,
  } = useCheckout();
  const [isPaying, setIsPaying] = useState(false);
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");
  const [nextClicked, setNextClicked] = useState(false);
  // Shipping Address Related.  These will be populated if user is signed up and signed in.
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
    billingSame,
    setBillingSame,
    handlers,
  } = shippingContext;
  // Billing Address Related
  const billingContext = useBilling();
  const {
    errors: billingErrors,
    setErrors: setBillingErrors,
    guestEmail,
    setGuestEmail,
    firstName: billingFirstName,
    lastName: billingLastName,
    address: billingAddress,
    addressContinued: billingAddressContinued,
    city: billingCity,
    stateProvince: billingStateProvince,
    postalCode: billingPostalCode,
    destinationCountryCode: billingDestinationCountryCode,
    handlers: billingHandlers,
  } = billingContext;

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

  // const anonEmailRef = useRef(orderEmail);
  useEffect(() => {
    console.log(`Checkout.js -> orderEmail: ${orderEmail}`);
  }, [orderEmail]);

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
    const validEmail = validateForm(setOrderEmailErrors, {
      field: "order_email",
      value: orderEmail,
      validator: validateEmail,
      message: "Order Email is required/invalid.",
    });
    if (!validEmail) return;
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
        ? new Address(
            address,
            city,
            stateProvince,
            postalCode,
            destinationCountryCode,
            addressContinued,
            firstName,
            lastName
          )
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
      setNextClicked(true);
    }
  }
  // This should only be called for signed up users, not anonymous users
  // See example in handleNext
  const saveShipping = async (userAddress) => {
    const { data, error } = await serverSaveUserAddress(
      JSON.stringify(userAddress)
    );
  };
  return (
    <>
      <div
        className={`fixed top-0 left-0 ${isPaying ? "" : "hidden"} grid place-items-center h-screen w-screen`}
      >
        <Spinner />
      </div>
      <div className="bg-white">
        <h1 className="text-3xl bg-primary-50 pb-4 dark:text-primary-100 text-center dark:bg-primary-950">
          Checkout
        </h1>
        <div className="relative mx-auto grid max-w-7xl dark:bg-primary-950 bg-primary-50 rid-cols-1 gap-x-0 lg:grid-cols-2 lg:px-8 lg:pt-4">
          <PayPalCheckoutTotal
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
              {!nextClicked ? (
                <>
                  <PayPalCheckoutShipping
                    countries={countries}
                    orderEmailErrors={orderEmailErrors}
                    setOrderEmailErrors={setOrderEmailErrors}
                    orderEmail={orderEmail}
                    handleOrderEmail={handleOrderEmail}
                    billingSame={billingSame}
                    setBillingSame={setBillingSame}
                    shippingAddress={{
                      firstName,
                      lastName,
                      address,
                      addressContinued,
                      city,
                      stateProvince,
                      postalCode,
                      destinationCountryCode,
                    }}
                    shippingErrors={shippingErrors}
                    handlers={handlers}
                  />
                  <PayPalCheckoutBilling
                    display={!billingSame}
                    countries={countries}
                    billingAddress={{
                      billingFirstName,
                      billingLastName,
                      billingAddress,
                      billingAddressContinued,
                      billingCity,
                      billingStateProvince,
                      billingPostalCode,
                      billingDestinationCountryCode,
                    }}
                    billingErrors={billingErrors}
                    billingHandlers={billingHandlers}
                  />
                </>
              ) : (
                <>
                  <PayPalCheckoutAddressList
                    display={true}
                    setNextClicked={setNextClicked}
                    orderEmail={orderEmail}
                    checkoutAddress={[
                      firstName,
                      lastName,
                      address,
                      addressContinued,
                      city,
                      stateProvince,
                      postalCode,
                      destinationCountryCode,
                    ]}
                    title="Shipping"
                  />
                  <PayPalCheckoutAddressList
                    display={!billingSame}
                    setNextClicked={setNextClicked}
                    checkoutAddress={[
                      billingFirstName,
                      billingLastName,
                      billingAddress,
                      billingAddressContinued,
                      billingCity,
                      billingStateProvince,
                      billingPostalCode,
                      billingDestinationCountryCode,
                    ]}
                    title="Billing"
                  />
                </>
              )}
              <div className={`mt-10 flex-row w-full justify-center `}>
                {!nextClicked && (
                  <button
                    className="text-primary-50 font-bold border border-primary-400 rounded-md px-3 py-2 bg-accent-600 w-full hover:cursor-pointer"
                    onClick={async (e) => {
                      // e.preventDefault() /* call this here if you need it. */
                      await handleNext(e);
                    }}
                  >
                    Next &rarr;
                  </button>
                )}
                {nextClicked && (
                  <PayPalCheckoutButtons
                    isPaying={isPaying}
                    setIsPaying={setIsPaying}
                    orderEmail={orderEmail}
                    cart={cart}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    shippingCostCents={shippingCostCents}
                    shippingAddress={[
                      firstName,
                      lastName,
                      address,
                      addressContinued,
                      city,
                      stateProvince,
                      postalCode,
                      destinationCountryCode,
                    ]}
                    billingAddress={[
                      billingFirstName,
                      billingLastName,
                      billingAddress,
                      billingAddressContinued,
                      billingCity,
                      billingStateProvince,
                      billingPostalCode,
                      billingDestinationCountryCode,
                    ]}
                    is_anonymous={user.is_anonymous}
                    email={user.email}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default PayPalCheckout;
