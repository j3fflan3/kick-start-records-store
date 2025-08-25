"use client";
import { useState } from "react";
import { formatDollars } from "@/src/app/_library/utilities";
import BuyNowCheckoutTotal from "@/src/app/_components/buy-now/BuyNowCheckoutTotal";
import BuyNowPaymentChoice from "@/src/app/_components/buy-now/BuyNowPaymentChoice";
import BuyNowCard from "@/src/app/_components/buy-now/BuyNowCard";
import BuyNowPayPal from "@/src/app/_components/buy-now/BuyNowPayPal";

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
  const [isPaying, setIsPaying] = useState(false);
  const [payWith, setPayWith] = useState("");
  const [tax, setTax] = useState(0);
  const [subtotal, setSubtotal] = useState("");
  const total = formatDollars(product.price + tax);
  const createOrder = async () => {};
  const onApprove = async () => {};
  const onError = async () => {};
  console.log(
    `BuyNowCheckout -> product:\n:${(JSON.stringify(product), null, "\t")}`
  );
  return (
    <>
      <div className="bg-white">
        <h1 className="text-3xl bg-primary-50 pb-4 dark:text-primary-100 text-center dark:bg-primary-950">
          Buy Now
        </h1>
        <div className="relative mx-auto grid max-w-7xl dark:bg-primary-950 bg-primary-50 grid-cols-1 gap-x-0 lg:grid-cols-2 lg:px-8 lg:pt-4">
          <BuyNowCheckoutTotal product={product} total={total} tax={tax} />
          <section
            aria-labelledby="payment-and-shipping-heading"
            className="dark:bg-primary-100 bg-primary-100 py-4 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:px-4 lg:py-4 lg:pb-24 lg:rounded-l-md"
          >
            {payWith === "" && <BuyNowPaymentChoice setPayWith={setPayWith} />}
            {payWith === "card" && (
              <BuyNowCard
                isPaying={isPaying}
                setIsPaying={setIsPaying}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            )}
            {payWith === "paypal" && (
              <BuyNowPayPal
                isPaying={isPaying}
                setIsPaying={setIsPaying}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            )}
            {/* <h2 id="payment-and-shipping-heading" className="sr-only">
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
              )} */}
            {/* <div className={`mt-10 flex-row w-full justify-center `}>
                {!nextClicked && (
                  <button
                    className="text-primary-50 font-bold border border-primary-400 rounded-md px-3 py-2 bg-accent-600 w-full hover:cursor-pointer"
                    onClick={async (e) => {
                      // e.preventDefault() 
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
              </div> */}
            {/* </div> */}
          </section>
        </div>
      </div>
    </>
  );
}

export default BuyNowCheckout;
