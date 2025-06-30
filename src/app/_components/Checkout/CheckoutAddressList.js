import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "../tailwind/description-list";

function CheckoutAddressList({ billingSame, title, context }) {
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
  return (
    <div>
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900"
      >
        {title}
      </h3>
      <DescriptionList>
        <DescriptionTerm className="!text-primary-950">Name</DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {firstName} {lastName}
        </DescriptionDetails>
        <DescriptionTerm className="!text-primary-950">Address</DescriptionTerm>
        <DescriptionDetails className="!text-primary-900">
          {address}
        </DescriptionDetails>
        {addressContinued && (
          <DescriptionDetails className="!text-primary-900">
            {addressContinued}
          </DescriptionDetails>
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
