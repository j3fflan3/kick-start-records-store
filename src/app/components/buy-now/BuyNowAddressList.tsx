"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface BuyNowAddressListProps {
  setPayWith: (value: string) => void;
  checkoutAddress: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  title: string;
}

function BuyNowAddressList({ setPayWith, checkoutAddress, title }: BuyNowAddressListProps) {
  const [showAddress, setShowAddress] = useState(false);
  // Note that checkoutAddress is an array, and will be destructured in order
  const [
    orderEmail,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  ] = checkoutAddress;
  return (
    <div className="ml-2">
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
            {address}...
          </div>
        )}
      </div>

      {showAddress && (
        <div className=" outline outline-primary-100 p-2 bg-primary-50 rounded-sm">
          <div className="grid grid-cols-2">
            <div>
              <h4 className="text-lg font-bold text-gray-900 ml-1">Address</h4>
            </div>
            <div className="!text-primary-950 mt-2 ml-auto">
              <button
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPayWith("");
                }}
              >
                <PencilSquareIcon className="size-5" />
              </button>
            </div>
          </div>

          {orderEmail && (
            <div className="mt-2 mb-2 ml-1">
              <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                {orderEmail}
              </span>
            </div>
          )}
          <div className="mt-2 ml-1">
            <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
              {address}
            </span>
          </div>
          {addressContinued && (
            <div className="mt-2 ml-1">
              <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
                {addressContinued}
              </span>
            </div>
          )}
          <div className="mt-2 mb-2 ml-1">
            <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
              {city}, {stateProvince} {postalCode}
              <br />
              {destinationCountryCode}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyNowAddressList;
