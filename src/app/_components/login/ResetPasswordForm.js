"use client";

import { serverResetPassword } from "@/src/app/_library/serverActions";
import { validateEmail, validateForm } from "@/src/app/_library/utilities";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import SubmitButton from "../buttons/SubmitButton";

const initialState = { message: "" };

function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    serverResetPassword,
    initialState
  );
  const [email, setEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [errors, setErrors] = useState({});

  const formRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success") {
        router.push(
          `/account/check-email/${encodeURIComponent(email)}?action=reset`
        );
      } else {
        setResetMessage(message);
      }
    }
    if (errors?.email) {
      setEmail("");
      emailRef.current.focus();
    }
  }, [state, setResetMessage, router, errors, email]);

  function handleEmail(e) {
    if (resetMessage !== "") setResetMessage("");
    setErrors({});
    setEmail(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const valid = validateForm(setErrors, {
      field: "email",
      value: email,
      validator: validateEmail,
      message: "Email is invalid.",
    });
    if (valid) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
            Reset Password
          </h2>
          <p className="text-left text-primary-700 mb-2 dark:text-primary-200">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>
        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} ref={formRef} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="text-sm/6 font-medium dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-primary-800 outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                  placeholder="you@email.com"
                  ref={emailRef}
                  value={email}
                  onChange={handleEmail}
                  autoFocus
                  required
                  autoComplete="email"
                />
                <p className="ml-2 mt-2 text-sm text-red-700">
                  {errors?.email && errors.email}
                </p>
              </div>
            </div>
            <div>
              <SubmitButton
                cssClasses="rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer"
                onClick={handleSubmit}
              >
                Send Reset Link
              </SubmitButton>
            </div>
            {resetMessage !== "" && (
              <p className="text-lg text-left mt-4 dark:text-primary-50">
                {resetMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPasswordForm;
