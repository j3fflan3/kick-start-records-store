"use client";

// import CardCheckoutButton from "@/src/app/_components/checkout/CardCheckoutButton";
import CheckoutAddressList from "@/src/app/_components/checkout/CheckoutAddressList";
import CheckoutPayPal from "@/src/app/_components/checkout/CheckoutPayPal";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBilling } from "@/src/app/_contexts/BillingProvider";
import { useShipping } from "@/src/app/_contexts/ShippingProvider";
import { Address, UserAddress } from "@/src/app/_library/model/address";
import { PayPalAddress } from "@/src/app/_library/model/paypal";
import CheckoutBilling from "@/src/app/_components/checkout/CheckoutBilling";
import CheckoutShipping from "@/src/app/_components/checkout/CheckoutShipping";
import CheckoutTotal from "@/src/app/_components/checkout/CheckoutTotal";

function Checkout({ cart, countries }) {
  // Checkout will always have a cart of at least one item.  All items will have the same
  const router = useRouter();
  // use hooks and funcs
  const { session } = useSession();
  const { user } = session || { user: null };
  console.log(user);
  // State & Hooks
  const [nextClicked, setNextClicked] = useState(false);
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

  // Billing
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
  } = billingContext;

  let showPayPalButtons = !editBilling && !editShipping && nextClicked;

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

  // const anonEmailRef = useRef(guestEmail);
  useEffect(() => {
    console.log(
      `Checkout.js -> guestEmail: ${guestEmail}, nextClicked: ${nextClicked}`
    );
  }, [guestEmail, nextClicked]);

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
      setEditShipping(false);
      setEditBilling(false);
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
            {showPayPalButtons ? (
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
            ) : showPayPalButtons ? (
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
            {user?.is_anonymous && (
              <div className={`mt-6`}>
                <label
                  htmlFor="first_name"
                  className=" text-sm/6 font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-2">
                  <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                    {guestEmail}
                  </span>
                  {/* <input
                    type="text"
                    name="guest_email"
                    placeholder=""
                    className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  /> */}
                </div>
                {/* <p className="ml-2 mt-2 text-sm text-red-700">
                  {billingErrors?.guest_email && billingErrors.guest_email}
                </p> */}
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
              <CheckoutPayPal
                guestEmail={guestEmail}
                billAddress={billAddress}
                billingFirstName={billingFirstName}
                billingLastName={billingLastName}
                billingSame={billingSame}
                cart={cart}
                subtotal={subtotal}
                shippingAddress={shippingAddress}
                shippingCost={shippingCost}
                shippingCostCents={shippingCostCents}
                is_anonymous={user.is_anonymous}
                email={user.email}
                firstName={firstName}
                lastName={lastName}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
