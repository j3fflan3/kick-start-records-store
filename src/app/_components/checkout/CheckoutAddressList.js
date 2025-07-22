import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../tailwind/description-list";
import { useState } from "react";

function CheckoutAddressList({
  billingSame,
  setEditAddresses,
  title,
  context,
}) {
  const {
    firstName,
    lastName,
    destinationCountryCode,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
  } = context;
  const [showAddress, setShowAddress] = useState(false);

  return (
    <div className="outline text-gray-300 p-4 rounded-sm mb-3">
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900 rounded-sm bg-gray-100 p-2 cursor-pointer"
        onClick={() => setShowAddress((state) => !state)}
      >
        {title}&nbsp;
      </h3>
      <DescriptionList className={`${showAddress ? "" : "hidden"}`}>
        <DescriptionTerm className="!text-primary-950">
          {" "}
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditAddresses(true);
            }}
          >
            <PencilSquareIcon className="size-5" />
          </button>
        </DescriptionTerm>
        <DescriptionDetails className="!text-primary-950"> </DescriptionDetails>
        <DescriptionTerm className="!text-primary-950">Name</DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {firstName} {lastName}
        </DescriptionDetails>
        <DescriptionTerm className="!text-primary-950">Address</DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {address}
        </DescriptionDetails>
        {addressContinued && (
          <>
            <DescriptionTerm></DescriptionTerm>
            <DescriptionDetails className="!text-primary-900">
              {addressContinued}
            </DescriptionDetails>
          </>
        )}
        <DescriptionTerm className="!text-primary-950">
          City, State/Province, Postal Code
        </DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {city}, {stateProvince} {postalCode}
        </DescriptionDetails>
        <DescriptionTerm className="!text-primary-950">Country</DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {destinationCountryCode}
        </DescriptionDetails>

        {billingSame && (
          <>
            {" "}
            <DescriptionTerm className="!text-primary-950">
              Billing Same as Shipping?
            </DescriptionTerm>
            <DescriptionDetails
              className={`${billingSame ? "!text-green-600" : "!text-red-600"}`}
            >
              {billingSame ? "✓" : "ⅹ"}
            </DescriptionDetails>
          </>
        )}
      </DescriptionList>
    </div>
  );
}

export default CheckoutAddressList;
