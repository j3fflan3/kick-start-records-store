"use client";

import { useActionState, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import { clientSignIn } from "@/src/app/_library/clientActions";
import { validateEmail } from "@/src/app/_library/utilities";
import Link from "next/link";

const initialState = {
  message: "",
};
function SignInForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(clientSignIn, initialState);

  const [email, setEmail] = useState("");
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
        toast.success("You've successfully logged in!", {
          id: "loggedIn",
          position: "top-right",
          duration: 2000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        setSuccessMessage(true); // this is to avoid double success messages
        router.push("/records");
      } else if (message === "error") {
        setEmail("");
        setPassword("");
        toast.error(
          "Log In failed.  Please verify your email or password and try again",
          { id: "loginError", position: "top-right" }
        );
      }
    }
  }, [state, setEmail, setPassword, router, successMessage, setSuccessMessage]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base dark:text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium dark:text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/account/reset-password"
                    className="font-semibold text-accent-500 hover:text-accent-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handlePassword}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              {/* className="flex w-full justify-center rounded-md bg-accent-500
              px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs
              hover:bg-accent-400 focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-accent-500" */}
              <SubmitButton
                disabled={!isSubmittable}
                cssClasses={
                  isSubmittable
                    ? `rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer`
                    : `rounded-md bg-accent-500 font-bold px-3 py-2 w-full text-2xl text-primary-100 cursor-not-allowed`
                }
              >
                Sign in
              </SubmitButton>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            New customer?{" "}
            <Link
              href="/account/verify-human"
              className="font-semibold text-accent-500 hover:text-accent-400"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignInForm;
