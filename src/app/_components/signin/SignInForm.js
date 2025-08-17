"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import { clientSignIn } from "@/src/app/_library/client/user";
import { validateEmail } from "@/src/app/_library/utilities";
import Link from "next/link";

const initialState = {
  message: "",
};
function SignInForm({
  titlePlacement = "text-center",
  hideNewCustomer = false,
  title = "Sign In",
  checkoutMessage = null,
  buttonText = "Sign In",
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(clientSignIn, initialState);

  const [email, setEmail] = useState("");
  const emailRef = useRef(null);
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const isValidEmail = validateEmail(email) || email === "";
  const isSubmittable = email !== "" && password !== "" && isValidEmail;

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (
        message === "success" &&
        typeof window !== "undefined" &&
        !successMessage
      ) {
        setSuccessMessage(true); // this is to avoid double success messages
        if (checkoutMessage) router.push("/checkout/payment");
        else router.push("/records");
      } else if (message === "error") {
        emailRef.current.focus();
        setEmail("");
        setPassword("");

        toast.error(
          "Log In failed.  Please verify your email or password and try again",
          { id: "loginError", position: "top-right" }
        );
      }
    }
  }, [
    state,
    setEmail,
    setPassword,
    router,
    successMessage,
    setSuccessMessage,
    checkoutMessage,
    emailRef,
  ]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2
            className={`mt-4 ${titlePlacement} text-2xl/9 font-bold tracking-tight dark:text-white`}
          >
            {title}
          </h2>
          {checkoutMessage && <p className="mt-2">{checkoutMessage}</p>}
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} className="space-y-6">
            <div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  ref={emailRef}
                  value={email}
                  onChange={handleEmail}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white dark:text-primary-900 px-3 py-1.5 text-base outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-primary-900 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="mt-8">
              {/* className="flex w-full justify-center rounded-md bg-accent-500
              px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs
              hover:bg-accent-400 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-accent-500" */}
              <SubmitButton
                disabled={!isSubmittable}
                cssClasses={
                  isSubmittable
                    ? `rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-50 hover:bg-accent-600 active:bg-accent-500 cursor-pointer`
                    : `rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-100 cursor-not-allowed`
                }
              >
                {buttonText}
              </SubmitButton>
            </div>
          </form>
          <p className="mt-4 text-center text-sm/6 text-gray-400">
            <Link
              href="/account/reset-password"
              className="font-semibold text-accent-500 hover:text-accent-400"
            >
              Forgot password?
            </Link>
          </p>
          {!hideNewCustomer && (
            <p className="mt-2 text-center text-sm/6 text-gray-400">
              New customer?{" "}
              <Link
                href="/account/verify-human"
                className="font-semibold text-accent-500 hover:text-accent-400"
              >
                Sign up here
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default SignInForm;
