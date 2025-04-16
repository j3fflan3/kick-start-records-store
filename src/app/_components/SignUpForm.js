"use client";

import SubmitButton from "@/src/app/_components/SubmitButton";
import { serverSignUp } from "@/src/app/_library/serverActions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  data: {},
};
function SignUpForm({ token }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    serverSignUp,
    initialState
  );
  // const [token, setToken] = useState("");
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

  useEffect(() => {
    if (state?.data?.user?.id) {
      const user = state.data.user;
      const encodedEmail = encodeURIComponent(user.email);
      const identities = state.data.identities;
      console.log(`state: ${JSON.stringify(state)}`);
      // captchaRef.current.resetCaptcha();
      let captchaToken = "";
      if (identities.length > 0) {
        const identity = state.data.identities[0];
        captchaToken = identity.identity_data.captchaToken;
      }
      router.push(
        `/account/check-email/${encodedEmail}?captchaToken=${captchaToken}&action=signup`
      );
      //state.data?.identities[0]?.identity_data?.email_verified === false
      //router.push("/account/check-email");
    }
  }, [state, router]);

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
  // console.log(token);
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
            {/* <HCaptcha
              sitekey={hCaptchaSiteKey}
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
            /> */}
          </div>
          <div className="flex w-full content-center">
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
