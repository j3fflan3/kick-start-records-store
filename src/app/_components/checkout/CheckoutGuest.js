"use client";
import React from "react";
import { useBilling } from "../../_contexts/BillingProvider";
import { useRouter } from "next/navigation";
import { validateEmail, validateForm } from "../../_library/utilities";

function CheckoutGuest() {
  const billingContext = useBilling();
  const { guestEmail, setGuestEmail, errors, setErrors } = billingContext;
  const router = useRouter();
  const requiredValidator = (val) => val !== "";
  const handleGuestCheckout = () => {
    console.log(`Guest email: ${guestEmail}`);
    const validateGuestCheckout = validateForm(setErrors, {
      field: "guest_email",
      value: guestEmail,
      validator: validateEmail,
      message: "Email is invalid.",
    });
    if (validateGuestCheckout) {
      setErrors({}); // Clear any previous errors
      router.push("/checkout/payment");
    }
  };
  return (
    <div>
      <div className="mt-6">
        <input
          id="guest_email"
          name="guest_email"
          type="email"
          placeholder="Email Address"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          required
          autoComplete="email"
          className="block w-full rounded-md bg-white dark:text-primary-900 px-3 py-1.5 text-base outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
        />
        <p className="ml-2 mt-2 text-sm text-red-700">
          {errors?.guest_email && errors.guest_email}
        </p>
      </div>

      <button
        onClick={handleGuestCheckout}
        className="rounded-md bg-accent-600 font-bold mt-8 px-3 py-2 w-full text-2xl text-center text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer"
      >
        Continue as Guest
      </button>
    </div>
  );
}

export default CheckoutGuest;
