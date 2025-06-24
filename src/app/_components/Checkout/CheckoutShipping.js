"use client";

function CheckoutShipping({
  countries,
  errors,
  billingSame,
  setBillingSame,
  shippingContext,
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
    firstNameRef,
    lastNameRef,
    destinationCountryCodeRef,
    addressRef,
    cityRef,
    stateProvinceRef,
    postalCodeRef,
    handleAddress,
    handleAddressContinued,
    handleCity,
    handleStateProvince,
    handleFirstName,
    handleLastName,
    handleDestinationCountryCode,
    handlePostalCode,
  } = shippingContext;
  return (
    <div>
      <h3
        id="contact-info-heading"
        className="text-2xl font-bold text-gray-900"
      >
        Shipping Information
      </h3>
      <p className="text-primary-900 text-sm">
        Please enter your shipping address and email to calculate shipping and
        taxes
      </p>
      <div className="mt-6">
        <label
          htmlFor="first_name"
          className=" text-sm/6 font-medium text-gray-700"
        >
          First Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="first_name"
            placeholder=""
            className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            value={firstName}
            ref={firstNameRef}
            onChange={handleFirstName}
            required
          />
        </div>
        <p className="ml-2 mt-2 text-sm text-red-700">
          {errors?.first_name && errors.first_name}
        </p>
      </div>
      <div className="mt-6">
        <label
          htmlFor="last_name"
          className=" text-sm/6 font-medium text-gray-700"
        >
          Last Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="last_name"
            placeholder=""
            className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            required
            onChange={handleLastName}
            ref={lastNameRef}
            value={lastName}
          />
        </div>
        <p className="ml-2 mt-2 text-sm text-red-700">
          {errors?.last_name && errors.last_name}
        </p>
      </div>
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
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className=" text-sm/6 font-medium text-gray-700"
          >
            Address
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="address"
              placeholder=""
              className="block w-full rounded-md bg-white px-3 py-2 text-base dark:text-primary-950 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
              required
              onChange={handleAddress}
              ref={addressRef}
              value={address}
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.address && errors.address}
          </p>
          <div className="sm:col-span-3 mt-6">
            <div className="mt-2">
              <input
                type="text"
                name="address_continued"
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
              autoComplete="address-level2"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={city}
              ref={cityRef}
              onChange={handleCity}
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.city && errors.city}
          </p>
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
              id="state_province"
              name="state_province"
              type="text"
              autoComplete="state_province"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={stateProvince}
              ref={stateProvinceRef}
              onChange={handleStateProvince}
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.state_province && errors.state_province}
          </p>
        </div>

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
              ref={postalCodeRef}
              onChange={handlePostalCode}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-600 sm:text-sm/6"
            />
          </div>
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.postal_code && errors.postal_code}
          </p>
        </div>
      </div>
      <div className="mt-6 text-primary-900">
        <input
          type="checkbox"
          checked={billingSame}
          onChange={() => setBillingSame(!billingSame)}
          name="billingSameAsShipping"
        />
        &nbsp;Billing address is the same as Shipping
      </div>
    </div>
  );
}

export default CheckoutShipping;
