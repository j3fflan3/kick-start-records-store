"use client";

import { serverUpdatePassword } from "@/src/app/_library/serverActions";
import { validateForm, validatePassword } from "@/src/app/_library/utilities";
import { useActionState, useEffect, useRef, useState } from "react";
import SubmitButton from "../buttons/SubmitButton";
import PasswordUpdatedMessage from "./PasswordUpdatedMessage";

const initialState = { message: "" };

function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    serverUpdatePassword,
    initialState
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (state) {
      setUpdateMessage(state?.message || "");
    }
    if (errors?.password || errors?.confirm) {
      console.log(errors);

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
    }
  }, [state, errors]);

  function handlePassword(e) {
    if (updateMessage !== "") setUpdateMessage("");
    setErrors({});
    setPassword(e.target.value);
  }
  function handleConfirm(e) {
    if (updateMessage !== "") setUpdateMessage("");
    setErrors({});
    setConfirm(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("in handleSubmit");
    const valid = validateForm(
      setErrors,
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
    console.log(`valid=${valid}`);
    if (valid) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }

  return (
    <>
      {updateMessage === "success" && <PasswordUpdatedMessage />}
      {(updateMessage === "" || updateMessage !== "success") && (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
              Update Your Password
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action={formAction} ref={formRef} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium dark:text-white"
                >
                  Password:&nbsp;
                </label>
                <div className="mt-2">
                  <input
                    name="password"
                    type="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                    placeholder="Password"
                    ref={passwordRef}
                    value={password}
                    onChange={handlePassword}
                  />
                  <p className="ml-2 mt-2 text-sm text-red-700">
                    {errors?.password && errors.password}
                  </p>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm/6 font-medium dark:text-white"
                >
                  Confirm Password:&nbsp;
                </label>
                <div className="mt-2">
                  <input
                    name="confirm"
                    type="password"
                    placeholder="Confirm password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base dark:text-white outline-2 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-400 sm:text-sm/6"
                    ref={confirmRef}
                    value={confirm}
                    onChange={handleConfirm}
                  />
                  <p className="ml-2 mt-2 text-sm text-red-700">
                    {errors?.confirm && errors.confirm}
                  </p>
                </div>
              </div>
              <div>
                <SubmitButton
                  cssClasses="rounded-md bg-accent-600 font-bold px-3 py-2 w-full text-2xl text-primary-50 hover:bg-accent-600 active:bg-yellow-500 cursor-pointer"
                  onClick={handleSubmit}
                >
                  Update My Password
                </SubmitButton>
              </div>
              {updateMessage !== "" && (
                <p className="text-lg text-left mt-4 dark:text-primary-50">
                  {updateMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdatePasswordForm;
