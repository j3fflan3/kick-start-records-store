"use client";

function PayPalCheckoutBilling({
  display,
  countries,
  billingAddress: billingAdd,
  billingErrors,
  billingHandlers,
}) {
  if (!display) return;
  const {
    handleBillingFirstName,
    handleBillingLastName,
    handleBillingAddress,
    handleBillingAddressContinued,
    handleBillingCity,
    handleBillingStateProvince,
    handleBillingPostalCode,
    handleBillingDestinationCountryCode,
  } = billingHandlers;
  const {
    billingFirstName,
    billingLastName,
    billingAddress,
    billingAddressContinued,
    billingCity,
    billingStateProvince,
    billingPostalCode,
    billingDestinationCountryCode,
  } = billingAdd;
  return (
    <div className="mt-6">
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900"
      >
        Billing Information
      </h3>

      <div className="mt-6">
        <div className="mt-2">
          <label
            htmlFor="billing_first_name"
            className="block text-sm/6 font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="mt-2">
            <input
              id="billing_first_name"
              name="billing_first_name"
              type="text"
              value={billingFirstName}
              onChange={handleBillingFirstName}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_first_name &&
              billingErrors.billing_first_name}
          </p>
        </div>{" "}
        <div className="mt-2">
          <label
            htmlFor="billing_last_name"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="mt-2">
            <input
              id="billing_last_name"
              name="billing_last_name"
              type="text"
              value={billingLastName}
              onChange={handleBillingLastName}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_last_name &&
              billingErrors.billing_last_name}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="billing_address"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Address
          </label>
          <div className="mt-2">
            <input
              id="billing_address"
              name="billing_address"
              type="text"
              value={billingAddress}
              onChange={handleBillingAddress}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_address && billingErrors.billing_address}
          </p>
        </div>{" "}
        <div className="mt-2">
          <label
            htmlFor="billing_address_continued"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Address (optional)
          </label>
          <div className="mt-2">
            <input
              id="billing_address_continued"
              name="billing_address_continued"
              type="text"
              value={billingAddressContinued}
              onChange={handleBillingAddressContinued}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_address_continued &&
              billingErrors.billing_address_continued}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="billing_city"
            className="block text-sm/6 font-medium text-gray-700"
          >
            City
          </label>
          <div className="mt-2">
            <input
              id="billing_city"
              name="billing_city"
              type="text"
              value={billingCity}
              onChange={handleBillingCity}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_city && billingErrors.billing_city}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="billing_state_province"
            className="block text-sm/6 font-medium text-gray-700"
          >
            State/Province
          </label>
          <div className="mt-2">
            <input
              id="billing_state_province"
              name="billing_state_province"
              type="text"
              value={billingStateProvince}
              onChange={handleBillingStateProvince}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_state_province &&
              billingErrors.billing_state_province}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="billing_postal_code"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Postal code
          </label>
          <div className="mt-2">
            <input
              id="billing_postal_code"
              name="billing_postal_code"
              type="text"
              value={billingPostalCode}
              onChange={handleBillingPostalCode}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {billingErrors?.billing_postal_code &&
              billingErrors.billing_postal_code}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="billing_country"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Destination Country
          </label>
          <div className="mt-2">
            <select
              name="billing_country"
              className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
              onChange={handleBillingDestinationCountryCode}
              value={billingDestinationCountryCode}
            >
              {countries.map((country) => (
                <option value={country.alpha2} key={country.alpha2}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayPalCheckoutBilling;
