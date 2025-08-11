"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";

function PayPalCheckoutShippingList({
  nextClicked,
  setNextClicked,
  orderEmail,
  postalCode,
  destinationCountryCode,
}) {
  return (
    <div>
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900"
      >
        Shipping Information
      </h3>
      <div className="!text-primary-950 mt-6">
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
      <div className="mt-2">
        <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
          Order Email: {orderEmail}
        </span>
      </div>
      <div className="mt-2">
        <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
          Destination Country: {destinationCountryCode}
        </span>
      </div>
      <div className="mt-2">
        <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
          Postal code: {postalCode}
        </span>
      </div>
    </div>
  );
}

export default PayPalCheckoutShippingList;
