"use client";

function PayPalCheckoutShipping({
  errors,
  countries,
  orderEmail,
  postalCode,
  handlePostalCode,
  destinationCountryCode,
  handleDestinationCountryCode,
}) {
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
      <div className="my-6">
        <label
          htmlFor="first_name"
          className=" text-sm/6 font-medium text-gray-700"
        >
          Order Email
        </label>
        <div className="mt-2">
          <span className="py-2 text-base dark:text-primary-950  placeholder:text-gray-500  sm:text-sm/6">
            {orderEmail}
          </span>
        </div>
      </div>
      <div className="mt-6">
        <div className="mt-6">
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
        <div className="mt-6 ">
          <div>
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
              {errors?.postal_code && errors.postal_code}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayPalCheckoutShipping;
