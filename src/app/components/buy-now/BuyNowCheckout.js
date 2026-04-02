"use client";
import { useCallback, useEffect, useState } from "react";
import { formatDollars } from "@/src/app/library/utilities";
import BuyNowCheckoutTotal from "@/src/app/components/buy-now/BuyNowCheckoutTotal";
import BuyNowPaymentChoice from "@/src/app/components/buy-now/BuyNowPaymentChoice";
import BuyNowPayment from "@/src/app/components/buy-now/BuyNowPayment";

import BuyNowAddressList from "@/src/app/components/buy-now/BuyNowAddressList";
import Select from "react-select";
import classNames from "classnames";
import { useBilling } from "../../contexts/BillingProvider";

function BuyNowCheckout({ product, countries }) {
  const [isPaying, setIsPaying] = useState(false);
  const [payWith, setPayWith] = useState("");
  const [tax, setTax] = useState(0);
  const [cardErrors, setCardErrors] = useState({});
  const [payPalErrors, setPayPalErrors] = useState({});
  const [billingInfo, setBillingInfo] = useState({});
  const [countryOption, setCountryOption] = useState({
    value: "US",
    label: "United States of America (the)",
  });
  useEffect(() => {
    console.log(`billingInfo changed: ${JSON.stringify(billingInfo, null, 2)}`);
  }, [billingInfo]);

  const countriesOptions = countries.map((country) => {
    return {
      value: country.alpha2,
      label: country.name,
    };
  });
  const {
    billingEmail: orderEmail,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
    setDestinationCountryCode,
    setBillingEmail,
    handlers,
  } = useBilling();
  const {
    handleBillingAddress,
    handleBillingAddressContinued,
    handleBillingCity,
    handleBillingStateProvince,
    handleBillingPostalCode,
  } = handlers;

  useEffect(() => {
    console.log(`BuyNowCheckout -> 
    orderEmail = ${orderEmail}
    address = ${address}
    addressContinued = ${addressContinued}
    city = ${city}
    stateProvince = ${stateProvince}
    postalCode = ${postalCode}
    destinationCountryCode = ${destinationCountryCode}`);
    setBillingInfo({
      orderEmail,
      address,
      addressContinued,
      city,
      stateProvince,
      postalCode,
      destinationCountryCode,
    });
  }, [
    orderEmail,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
    setBillingInfo,
  ]);
  useEffect(() => {
    setDestinationCountryCode(countryOption.value);
  }, [countryOption, setDestinationCountryCode]);

  useEffect(
    function () {
      console.log(
        `BuyNowCheckout -> product: ${JSON.stringify(product, null, 2)}`
      );
    },
    [product]
  );
  const total = formatDollars(product.price + tax);

  function handleOrderEmail(e) {
    setPayPalErrors({});
    setCardErrors({});
    setBillingEmail(e.target.value);
  }
  // Note that we are hiding BuyNowPayment below rather than writing it based on a variable.
  // This ensures the script loads with the page even though it's hidden.
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
            {payWith === "" && (
              <>
                <h3 className="ml-2 mb-2 text-xl text-primary-900">
                  Enter Billing Details
                </h3>
                <div className="grid grid-cols-2 mb-2">
                  <div className="col-span-2 my-2 mr-3.25">
                    <input
                      type="email"
                      value={orderEmail}
                      onChange={handleOrderEmail}
                      required
                      placeholder="Email"
                      className="w-full ml-1.5 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                    />
                  </div>
                  <p className="ml-2 mt-2 text-sm text-red-700">
                    {cardErrors?.email && cardErrors.email}
                    {payPalErrors?.email && payPalErrors.email}
                  </p>

                  <div className="col-span-2 my-2 mr-3.25">
                    <input
                      type="text"
                      value={address}
                      onChange={handleBillingAddress}
                      required
                      placeholder="Billing Address"
                      className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                    />
                  </div>
                  <div className="col-span-2 my-2 mr-3.25">
                    <input
                      type="text"
                      value={addressContinued}
                      onChange={handleBillingAddressContinued}
                      placeholder="Billing Address Continued (optional)"
                      className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 col-span-2 w-full my-2 mr-3.25">
                    <div className="col-span-1 mr-2">
                      <input
                        type="text"
                        value={city}
                        onChange={handleBillingCity}
                        placeholder="City"
                        required
                        className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                      />
                    </div>
                    <div className="ml-2 col-span-1 mr-3.25">
                      <Select
                        options={countriesOptions}
                        name="country"
                        classNames={{
                          control: () =>
                            classNames(
                              "w-full h-fit ml-1.5 mt-4 px-3 py-3.5 border !border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                            ),
                          option: (provided) => (
                            {
                              ...provided,
                            },
                            classNames("!text-[#687173]")
                          ),
                        }}
                        onChange={(option) => setCountryOption(option)}
                        value={countryOption}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 col-span-2 w-full my-2 mr-3.25">
                    <div className="mr-2">
                      <input
                        type="text"
                        value={stateProvince}
                        onChange={handleBillingStateProvince}
                        placeholder="State / Province"
                        required
                        className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                      />
                    </div>
                    <div className="ml-2 mr-3.25">
                      <input
                        type="text"
                        value={postalCode}
                        onChange={handleBillingPostalCode}
                        placeholder="Postal Code"
                        required
                        className="w-full ml-1.5  mt-4 px-3 py-5 border border-[#909697] rounded-sm text-[#687173] font-courier placeholder:text-[#000] placeholder:opacity-100 font-light bg-white"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {payWith === "" && <BuyNowPaymentChoice setPayWith={setPayWith} />}
            <div className={`${payWith !== "" ? "" : "hidden"} col-span-1`}>
              <BuyNowAddressList
                setPayWith={setPayWith}
                checkoutAddress={[
                  orderEmail,
                  address,
                  addressContinued,
                  city,
                  stateProvince,
                  postalCode,
                  destinationCountryCode,
                ]}
                title="Billing"
              />
              <BuyNowPayment
                cardErrors={cardErrors}
                setCardErrors={setCardErrors}
                payPalErrors={payPalErrors}
                setPayPalErrors={setPayPalErrors}
                setBillingInfo={setBillingInfo}
                setPayWith={setPayWith}
                payWith={payWith}
                isPaying={isPaying}
                setIsPaying={setIsPaying}
                billingInfo={billingInfo}
                product={product}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default BuyNowCheckout;
