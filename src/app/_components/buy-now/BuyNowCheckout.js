"use client";
import { useState } from "react";
import Spinner from "../spinners/Spinner";
import PayPalCheckoutTotal from "../paypal/PayPalCheckoutTotal";
import PayPalCheckoutShipping from "../paypal/PayPalCheckoutShipping";
import PayPalCheckoutBilling from "../paypal/PayPalCheckoutBilling";
import PayPalCheckoutAddressList from "../paypal/PayPalCheckoutAddressList";
import PayPalCheckoutButtons from "../paypal/PayPalCheckoutButtons";

const temp = {
  artist: "Heart of Cygnus",
  catalogId: "8e29957c-dffb-4ad4-86ca-7931b8de61e5",
  title: "Hydra vs. Leviathan",
  image: {
    url: "https://vnshanftypzvajpbbwxr.supabase.co/storage/v1/object/public/images/hydraleviathancover.png",
    height: 2160,
    width: 2160,
    uom: "px",
  },
  description: "Fifth release by Heart of Cygnus",
  upc: null,
  productType: "Record",
  recordFormat: "DigitalDownload",
  recordGenre: "Metal",
  releaseDate: "2016-03-31T07:00:00+00:00",
  price: 99,
  weight: 0,
  attributes: {
    tracks: [
      {
        title: "Hydra vs. Leviathan",
        length: "00:05:22",
        number: 1,
        publishers: ["Magnificent Three Music"],
        songwriters: ["Jeffrey Robert Lane"],
      },
    ],
  },
};

function BuyNowCheckout({ product }) {
  const [payWith, setPayWith] = useState("");

  console.log(
    `BuyNowCheckout -> product:\n:${(JSON.stringify(product), null, "\t")}`
  );
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
        <div className="relative mx-auto grid max-w-7xl dark:bg-primary-950 bg-primary-50 grid-cols-1 gap-x-0 lg:grid-cols-2 lg:px-8 lg:pt-4">
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

export default BuyNowCheckout;
