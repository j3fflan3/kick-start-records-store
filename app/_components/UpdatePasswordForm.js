"use client";

import { useActionState, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { serverUpdatePassword } from "../_library/serverActions";
import { validatePassword } from "../_library/utilities";
import SpinnerMini from "./SpinnerMini";
const initialState = { message: "" };
function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    serverUpdatePassword,
    initialState
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const isSubmittable = validatePassword(password, confirm);

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success") {
        toast.success("✅ You have successfully updated your password.");
      } else if (message === "error") {
        setPassword("");
        setConfirm("");
        toast.error("🤒 There was an error resetting your password.");
      }
    }
  }, [state, setPassword, setConfirm]);

  function handlePassword(e) {
    setPassword(e.target.value);
  }
  function handleConfirm(e) {
    setConfirm(e.target.value);
  }
  return (
    <div>
      <form action={formAction}>
        <div className="grid-flow-row">
          <div className="form-row">
            <label htmlFor="password">Password:&nbsp;</label>
            <input
              name="password"
              type="password"
              className={`rounded-md border ${
                isSubmittable ? "border-green-500" : "border-accent-500"
              }`}
              placeholder="password"
              value={password}
              onChange={handlePassword}
            />
          </div>
          <div className="form-row">
            <label htmlFor="confirm">Confirm Password:&nbsp;</label>
            <input
              name="confirm"
              type="password"
              className={`rounded-md border ${
                isSubmittable ? "border-green-500" : "border-accent-500"
              }`}
              value={confirm}
              onChange={handleConfirm}
            />
          </div>
          <div>
            <button
              disabled={!isSubmittable}
              className="bg-accent-600 mb-3 mt-3 mr-4 ml-4 px-3 py-1  border-primary-500 rounded-md"
            >
              {isPending ? <SpinnerMini /> : "Reset My Password"}
            </button>
            <Toaster />
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdatePasswordForm;
