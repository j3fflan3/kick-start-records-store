"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { serverSignUp } from "@/app/_library/serverActions";
import SubmitButton from "./SubmitButton";
import HCaptcha from "@hcaptcha/react-hcaptcha";
const initialState = {
  message: "",
};
function SignUpForm() {
  const [state, formAction, isPending] = useActionState(
    serverSignUp,
    initialState
  );
  const [token, setToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const isSubmittable =
    token !== "" &&
    firstName !== "" &&
    lastName !== "" &&
    email !== "" &&
    password !== "" &&
    confirm !== "";
  const captchaRef = useRef(null);
  const onLoad = () => {
    captchaRef.current.execute();
  };
  useEffect(() => {
    if (state) console.log(`state: ${JSON.stringify(state)}`);
  }, [state]);
  function handleFirst(e) {
    setFirstName(e.target.value);
  }
  function handleLast(e) {
    setLastName(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  function handleConfirm(e) {
    setConfirm(e.target.value);
  }

  return (
    <form action={formAction}>
      <div className="grid-flow-row">
        <div className="form-row">
          <label htmlFor="firstName">First Name:&nbsp;</label>
          <input
            name="firstName"
            type="text"
            className="rounded-md"
            placeholder="First name"
            value={firstName}
            onChange={handleFirst}
          />
        </div>
        <div className="form-row">
          <label htmlFor="lastName">Last Name:&nbsp;</label>
          <input
            name="lastName"
            type="text"
            className="rounded-md"
            placeholder="Last name"
            value={lastName}
            onChange={handleLast}
          />
        </div>
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
        <div className="form-row">
          <label htmlFor="confirm">Confirm Password:&nbsp;</label>
          <input
            name="confirm"
            type="password"
            className="rounded-md"
            value={confirm}
            onChange={handleConfirm}
          />
        </div>
        <div className="flex p-2 justify-center">
          {/* sitekey="cb2621b4-1a84-4afa-9818-08465b32ff34" */}
          <HCaptcha
            sitekey="10000000-ffff-ffff-ffff-000000000001"
            onLoad={onLoad}
            onVerify={setToken}
            ref={captchaRef}
          />
          <input
            type="hidden"
            name="captchaToken"
            value={token}
            readOnly={true}
          />
          {/* // value="10000000-aaaa-bbbb-cccc-000000000001" */}
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
            Sign Up
          </SubmitButton>
          <p aria-live="polite" role="status">
            {state?.message}
          </p>
        </div>
      </div>
    </form>
  );
}

export default SignUpForm;
