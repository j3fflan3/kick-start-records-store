"use client";

import { useActionState, useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clientSignIn } from "@/app/_library/clientActions";

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

  const isSubmittable = email !== "" && password !== "";

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success") {
        router.push("/");
      } else if (message === "error") {
        setEmail("");
        setPassword("");
        toast.error(
          "Log In failed.  Please verify your email or password and try again"
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
    <form action={formAction}>
      <div className="grid-flow-row">
        <div className="form-row">
          <label htmlFor="email">Email:&nbsp;</label>
          <input
            name="email"
            type="email"
            className="rounded-md"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password:&nbsp;</label>
          <input
            name="password"
            type="password"
            className="rounded-md"
            value={password}
            onChange={handlePassword}
          />
        </div>
        <div className="">
          <SubmitButton
            disabled={!isSubmittable}
            cssClasses={
              isSubmittable
                ? `rounded-md bg-yellow-600 font-bold p-2 w-1/2 hover:bg-accent-600 active:bg-yellow-500`
                : `rounded-md bg-primary-500 font-bold p-2 w-1/2`
            }
          >
            Log In
          </SubmitButton>
          <Toaster position="top-right" />
          {/* <p aria-live="polite" role="status">
            {state?.message}
          </p> */}
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
