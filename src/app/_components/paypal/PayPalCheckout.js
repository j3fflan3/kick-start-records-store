"use client";

// import CardCheckoutButton from "@/src/app/_components/checkout/CardCheckoutButton";
import PayPalCheckoutButtons from "@/src/app/_components/paypal/PayPalCheckoutButtons";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { useShippingCalculator } from "@/src/app/_hooks/useShippingCalculator";
import { cartItemsWeight, cartTotal } from "@/src/app/_library/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCheckout, useGuestEmail } from "../../_contexts/CheckoutProvider";
import PayPalCheckoutTotal from "./PayPalCheckoutTotal";
import PayPalCheckoutShipping from "@/src/app/_components/paypal/PayPalCheckoutShipping";

function PayPalCheckout({ cart, countries }) {
  // Checkout will always have a cart of at least one item.  All items will have the same
  const router = useRouter();
  // use hooks and funcs
  const { session } = useSession();
  const { user } = session || { user: null };
  console.log(user);
  const {
    orderEmail,
    postalCode,
    destinationCountryCode,
    handlePostalCode,
    handleDestinationCountryCode,
  } = useCheckout();
  // State & Hooks
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");

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

  return (
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
            <div className={`mt-6`}>
              <label
                htmlFor="first_name"
                className=" text-sm/6 font-medium text-gray-700"
              >
                Order Email
              </label>
              <div className="mt-2">
                <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                  {orderEmail}
                </span>
              </div>
            </div>
            <PayPalCheckoutShipping
              countries={countries}
              errors={errors}
              postalCode={postalCode}
              destinationCountryCode={destinationCountryCode}
              handleDestinationCountryCode={handleDestinationCountryCode}
              handlePostalCode={handlePostalCode}
            />
            <div className={`mt-10 flex-row w-full justify-center `}>
              <PayPalCheckoutButtons
                orderEmail={orderEmail}
                cart={cart}
                subtotal={subtotal}
                shippingCost={shippingCost}
                shippingCostCents={shippingCostCents}
                is_anonymous={user.is_anonymous}
                email={user.email}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PayPalCheckout;
