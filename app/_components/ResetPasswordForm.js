"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { serverResetPassword } from "../_library/serverActions";
import SpinnerMini from "./SpinnerMini";
import { validateEmail } from "../_library/utilities";
import toast, { Toaster } from "react-hot-toast";
const initialState = { message: "" };
function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    serverResetPassword,
    initialState
  );
  const [email, setEmail] = useState("");
  const isSubmittable = validateEmail(email);

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success") {
        toast.success("✅ Check your email for password update instructions.");
      } else if (message === "error") {
        setEmail("");
        toast.error("🤒 There was an error resetting your password.");
      }
    }
  }, [state, setEmail, router]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  return (
    <div>
      <form action={formAction}>
        <div className="grid-flow-row">
          <div className="form-row">
            <label htmlFor="email">Email:&nbsp;</label>
            <input
              name="email"
              type="email"
              className={`rounded-md border ${
                isSubmittable ? "border-green-500" : "border-accent-500"
              }`}
              placeholder="Email"
              value={email}
              onChange={handleEmail}
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

export default ResetPasswordForm;
