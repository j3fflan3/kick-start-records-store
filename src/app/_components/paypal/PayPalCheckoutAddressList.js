"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function PayPalCheckoutAddressList({
  display,
  setNextClicked,
  orderEmail,
  checkoutAddress,
  title,
}) {
  const [showAddress, setShowAddress] = useState(false);
  if (!display) return;
  // Note that checkoutAddress is an array, and will be destructured in order
  const [
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  ] = checkoutAddress;
  return (
    <div>
      <div
        className="flex outline text-gray-300 p-4 rounded-sm mb-3 cursor-pointer justify-start"
        onClick={() => setShowAddress((current) => !current)}
      >
        <h3
          id="contact-info-heading"
          className="text-2xl font-bold text-gray-900 align-baseline"
        >
          {title}{" "}
        </h3>
        {!showAddress && (
          <div className="ml-6 align-bottom pt-1 txt-sm font-normal">
            {firstName} {lastName}, {address}...
          </div>
        )}
      </div>

      {showAddress && (
        <>
          <div className="!text-primary-950 mt-2">
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setNextClicked((curVal) => !curVal);
              }}
            >
              <PencilSquareIcon className="size-5" />
            </button>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Address</h4>
          </div>

          <div className="mt-2">
            <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
              {firstName} {lastName}
            </span>
          </div>
          {orderEmail && (
            <div className="mt-2 mb-2">
              <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                {orderEmail}
              </span>
            </div>
          )}
          <div className="mt-2">
            <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
              {address}
            </span>
          </div>
          {addressContinued && (
            <div className="mt-2">
              <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                {addressContinued}
              </span>
            </div>
          )}
          <div className="mt-2 mb-2">
            <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
              {city}, {stateProvince} {postalCode}
              <br />
              {destinationCountryCode}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default PayPalCheckoutAddressList;
