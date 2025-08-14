"use client";

function PayPalCheckoutShipping({
  countries,
  orderEmailErrors,
  orderEmail,
  handleOrderEmail,
  billingSame,
  setBillingSame,
  shippingAddress,
  shippingErrors,
  handlers,
}) {
  const [
    handleFirstName,
    handleLastName,
    handleAddress,
    handleAddressContinued,
    handleCity,
    handleStateProvince,
    handlePostalCode,
    handleDestinationCountryCode,
  ] = handlers;
  const {
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
  } = shippingAddress;
  return (
    <div>
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900"
      >
        Shipping Information
      </h3>
      <p className="text-primary-900 text-sm mt-2">
        Please enter your shipping country and postal code to calculate shipping
        and taxes
      </p>

      <div className="mt-6">
        <div className="mt-6">
          <label
            htmlFor="order_email"
            className="text-sm/6 font-medium text-gray-700"
          >
            Order Email
          </label>
          <div className="mt-2">
            <input
              id="order_email"
              name="order_email"
              type="email"
              value={orderEmail}
              onChange={handleOrderEmail}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {orderEmailErrors?.order_email && orderEmailErrors.order_email}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="address"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Address
          </label>
          <div className="mt-2">
            <input
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={handleAddress}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {shippingErrors?.address && shippingErrors.address}
          </p>
        </div>{" "}
        <div className="mt-2">
          <label
            htmlFor="address_continued"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Address (optional)
          </label>
          <div className="mt-2">
            <input
              id="address_continued"
              name="address_continued"
              type="text"
              value={addressContinued}
              onChange={handleAddressContinued}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {shippingErrors?.address_continued &&
              shippingErrors.address_continued}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="city"
            className="block text-sm/6 font-medium text-gray-700"
          >
            City
          </label>
          <div className="mt-2">
            <input
              id="city"
              name="city"
              type="text"
              value={city}
              onChange={handleCity}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {shippingErrors?.city && shippingErrors.city}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="state_province"
            className="block text-sm/6 font-medium text-gray-700"
          >
            State/Province
          </label>
          <div className="mt-2">
            <input
              id="state_province"
              name="state_province"
              type="text"
              value={stateProvince}
              onChange={handleStateProvince}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {shippingErrors?.state_province && shippingErrors.state_province}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="postal_code"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Postal code
          </label>
          <div className="mt-2">
            <input
              id="postal_code"
              name="postal_code"
              type="text"
              value={postalCode}
              onChange={handlePostalCode}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {shippingErrors?.postal_code && shippingErrors.postal_code}
          </p>
        </div>
        <div className="mt-2">
          <label
            htmlFor="country"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Destination Country
          </label>
          <div className="mt-2">
            <select
              name="country"
              className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
              onChange={handleDestinationCountryCode}
              value={destinationCountryCode}
            >
              {countries.map((country) => (
                <option value={country.alpha2} key={country.alpha2}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-primary-900">
          <input
            type="checkbox"
            checked={billingSame}
            onChange={() => setBillingSame(!billingSame)}
            name="billingSameAsShipping"
          />
          &nbsp;Billing address is the same as Shipping
        </div>
      </div>
    </div>
  );
}

export default PayPalCheckoutShipping;
