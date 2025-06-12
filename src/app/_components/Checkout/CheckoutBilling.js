"use client";

export default function CheckoutBilling({ countries, errors, billingContext }) {
  const {
    firstName,
    lastName,
    address,
    addressContinued,
    city,
    stateProvince,
    postalCode,
    destinationCountryCode,
    firstNameRef,
    lastNameRef,
    addressRef,
    cityRef,
    stateProvinceRef,
    postalCodeRef,
    destinationCountryCodeRef,
    handleAddress,
    handleAddressContinued,
    handleCity,
    handleStateProvince,
    handleFirstName,
    handleLastName,
    handleDestinationCountryCode,
    handlePostalCode,
  } = billingContext;
  return (
    <div className="mt-6">
      <h3
        id="billing_info_heading"
        className="text-2xl font-bold text-gray-900"
      >
        Billing information
      </h3>
      <div className="mt-6">
        <label
          htmlFor="billing_first_name"
          className=" text-sm/6 font-medium text-gray-700"
        >
          First Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="billing_first_name"
            placeholder=""
            className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            value={firstName}
            ref={firstNameRef}
            onChange={handleFirstName}
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="billing_last_name"
          className=" text-sm/6 font-medium text-gray-700"
        >
          Last Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="billing_last_name"
            placeholder=""
            className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            required
            onChange={handleLastName}
            ref={lastNameRef}
            value={lastName}
          />
        </div>
      </div>
      <div className="mt-6">
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
            onChange={handleDestinationCountryCode}
            ref={destinationCountryCodeRef}
            value={destinationCountryCode}
          >
            {countries.map((country) => (
              <option value={country.alpha2} key={country.alpha2}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <p className="ml-2 mt-2 text-sm text-red-700">
          {errors?.country && errors.country}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label
            htmlFor="billing_address_line_1"
            className=" text-sm/6 font-medium text-gray-700"
          >
            Address
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="billing_address_line_1"
              placeholder=""
              className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
              required
              onChange={handleAddress}
              ref={addressRef}
              value={address}
            />
          </div>
          <div className="sm:col-span-3 mt-6">
            <div className="mt-2">
              <input
                type="text"
                name="billing_address_line_2"
                placeholder="(optional)"
                className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                required
                onChange={handleAddressContinued}
                value={addressContinued}
              />
            </div>
          </div>
        </div>
        <div>
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
              autoComplete="address-level2"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={city}
              ref={cityRef}
              onChange={handleCity}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="state_province"
            className="block text-sm/6 font-medium text-gray-700"
          >
            State / Province
          </label>
          <div className="mt-2">
            <input
              id="billing_state_province"
              name="billing_state_province"
              type="text"
              autoComplete="billing_state_province"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={stateProvince}
              ref={stateProvinceRef}
              onChange={handleStateProvince}
            />
          </div>
        </div>

        <div>
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
              value={postalCode}
              ref={postalCodeRef}
              onChange={handlePostalCode}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
