"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { serverSignUp } from "../_library/serverActions";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import SubmitButton from "./SubmitButton";
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
    <div className="w-full content-center">
      <form action={formAction}>
        <div className="grid-flow-row w-full box-border">
          <div className="flex w-full content-center pt-3 pb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full text-lg rounded-md p-3 text-primary-900"
              onChange={handleFirst}
              autoFocus
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full text-lg rounded-md p-3 text-primary-900"
              onChange={handleLast}
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full text-lg rounded-md p-3 text-primary-900"
              onChange={handleEmail}
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full text-lg rounded-md p-3 text-primary-900"
              onChange={handlePassword}
            />
          </div>
          <div className="flex w-full content-center pb-4">
            <input
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              className="w-full text-lg rounded-md p-3 text-primary-900"
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
              className="w-full"
            />
            <input
              type="hidden"
              name="captchaToken"
              value={token}
              readOnly={true}
            />
            {/* // value="10000000-aaaa-bbbb-cccc-000000000001" */}
          </div>
          <div className="flex w-full content-center">
            {/* <button className="bg-accent-700 px-3 py-2 w-full text-2xl border-primary-500 rounded-md font-bold">
              SIGN UP
            </button> */}
            <SubmitButton
              disabled={!isSubmittable}
              cssClasses={
                isSubmittable
                  ? `rounded-md bg-accent-700 font-bold px-3 py-2 text-2xl w-full hover:bg-yellow-600 active:bg-yellow-500`
                  : `rounded-md bg-primary-500 font-bold px-3 py-2 text-2xl w-full`
              }
            >
              Sign Up
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
