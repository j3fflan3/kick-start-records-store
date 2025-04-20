"use client";

import { useActionState, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import { clientSignIn } from "@/src/app/_library/clientActions";
import { validateEmail } from "@/src/app/_library/utilities";

const initialState = {
  message: "",
};

function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    clientSignIn,
    initialState
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isValidEmail = validateEmail(email) || email === "";
  const isSubmittable = email !== "" && password !== "";

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success" && typeof window !== "undefined") {
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
  }, [state, setEmail, setPassword, router]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }

  return (
    <div className="w-full content-center">
      <Toaster position="top-right" />
      <form action={formAction}>
        <div className="grid-flow-row w-full box-border">
          <div className="flex w-full content-center pt-3 pb-4">
            <input
              name="email"
              type="email"
              className={`rounded-md w-full p-3 text-lg text-primary-900 ${
                !isValidEmail && "border border-red-600"
              }`}
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              name="password"
              type="password"
              className="rounded-md w-full p-3 text-lg text-primary-900"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
            />
          </div>
          <div className="flex w-full content-center">
            <SubmitButton
              disabled={!isSubmittable}
              cssClasses={
                isSubmittable
                  ? `rounded-md bg-yellow-600 font-bold px-3 py-2 w-full text-2xl hover:bg-accent-600 active:bg-yellow-500`
                  : `rounded-md bg-primary-500 font-bold px-3 py-2 w-full text-2xl`
              }
            >
              Log In
            </SubmitButton>
            {/* <p aria-live="polite" role="status">
            {state?.message}
            </p> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
