"use client";
import { useRouter } from "next/navigation";
import { useCheckout } from "../../_contexts/CheckoutProvider";
import { validateEmail, validateForm } from "../../_library/utilities";

function PayPalCheckoutGuest() {
  const checkoutContext = useCheckout();
  const { orderEmail, handleOrderEmail, errors, setErrors } = checkoutContext;
  const router = useRouter();
  const handleGuestCheckout = () => {
    console.log(`Order email: ${orderEmail}`);
    const validateGuestCheckout = validateForm(setErrors, {
      field: "order_email",
      value: orderEmail,
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
          id="order_email"
          name="order_email"
          type="email"
          placeholder="Email Address"
          value={orderEmail}
          onChange={handleOrderEmail}
          required
          autoComplete="email"
          className="block w-full rounded-md bg-white dark:text-primary-900 px-3 py-1.5 text-base outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
        />
        <p className="ml-2 mt-2 text-sm text-red-700">
          {errors?.order_email && errors.order_email}
        </p>
      </div>

      <button
        onClick={handleGuestCheckout}
        className="rounded-md bg-accent-600 font-bold mt-6 px-3 py-2 w-full text-2xl text-center text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer"
      >
        Continue as Guest
      </button>
    </div>
  );
}

export default PayPalCheckoutGuest;
