"use client";

import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import { serverSignUp } from "@/src/app/_library/serverActions";
import {
  validateEmail,
  validateForm,
  validatePassword,
} from "@/src/app/_library/utilities";
import { useActionState, useEffect, useRef, useState } from "react";

const initialState = {
  data: {},
};
function SignUpForm({ token }) {
  // const router = useRouter();
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
  const [errors, setErrors] = useState({});
  const [mailingChecked, setMailingChecked] = useState(false);
  const [notifyChecked, setNotifyChecked] = useState(false);
  const [showPending, setShowPending] = useState(false);
  // refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const formRef = useRef(null);
  // We want to make sure they've at least filled out all the fields
  // before we let them hit the submit button and validate the values
  const isSubmittable =
    token !== "" &&
    firstName !== "" &&
    lastName !== "" &&
    email !== "" &&
    password !== "" &&
    confirm !== "";

  useEffect(
    function () {
      if (errors?.email) {
        setEmail("");
        emailRef.current.focus();
        return;
      }
      if (errors?.password) {
        setPassword("");
        setConfirm("");
        passwordRef.current.focus();
        return;
      }
      if (errors?.confirm) {
        setConfirm("");
        confirmRef.current.focus();
      }
    },
    [errors]
  );

  function handleFirst(e) {
    setErrors({});
    setFirstName(e.target.value);
  }
  function handleLast(e) {
    setErrors({});
    setLastName(e.target.value);
  }
  function handleEmail(e) {
    setErrors({});
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setErrors({});
    setPassword(e.target.value);
  }
  function handleConfirm(e) {
    setErrors({});
    setConfirm(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const valid = validateForm(
      setErrors,
      {
        field: "email",
        value: email,
        validator: validateEmail,
        message: "Email is invalid",
      },
      {
        field: "password",
        value: password,
        validator: validatePassword,
        message:
          "Password must be at least 8 characters in length and contain at least one of the following: Uppercase letter, lowercase letter, number, and special character (#?!@$%^&*-)",
      },
      {
        field: "confirm",
        value: confirm,
        validator: (conf) => conf === password,
        message: "Password confirmation does not match",
      }
    );
    if (valid) {
      setShowPending(true);
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }
  // console.log(token);
  return (
    <>
      <form action={formAction} ref={formRef} className="space-y-6">
        <div className="mt-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            value={firstName}
            onChange={handleFirst}
            required
          />
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            required
            onChange={handleLast}
            value={lastName}
          />
        </div>
        <div className="mt-2">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            onChange={handleEmail}
            ref={emailRef}
            value={email}
            required
            autoComplete="email"
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.email && errors.email}
          </p>
        </div>
        <div className="mt-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            onChange={handlePassword}
            ref={passwordRef}
            value={password}
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.password && errors.password}
          </p>
        </div>
        <div className="mt-2">
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
            onChange={handleConfirm}
            ref={confirmRef}
            value={confirm}
            required
          />
          <p className="ml-2 mt-2 text-sm text-red-700">
            {errors?.confirm && errors.confirm}
          </p>
        </div>
        <div className="mt-2">
          <input
            type="checkbox"
            name="mailingList"
            value="true"
            checked={mailingChecked}
            onChange={() => setMailingChecked(!mailingChecked)}
          />
          &nbsp; Sign me up for new release and sale notifications!
        </div>
        <div className="mt-2">
          <input
            type="checkbox"
            name="notifyList"
            value="true"
            checked={notifyChecked}
            onChange={() => setNotifyChecked(!notifyChecked)}
          />
          &nbsp; Email me when the site launches!
        </div>
        <input type="hidden" value={token} name="captchaToken" />
      </form>
      <div className="flex w-full pt-6 content-center">
        <SubmitButton
          disabled={!isSubmittable}
          cssClasses={
            isSubmittable
              ? `rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer`
              : `rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-100 cursor-not-allowed`
          }
          onClick={handleSubmit}
          showPending={showPending}
        >
          Sign Up
        </SubmitButton>
      </div>
    </>
  );
}

export default SignUpForm;
