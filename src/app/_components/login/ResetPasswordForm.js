"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { serverResetPassword } from "@/src/app/_library/serverActions";
import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";
import { validateEmail } from "@/src/app/_library/utilities";
import toast, { Toaster } from "react-hot-toast";
import SubmitButton from "../buttons/SubmitButton";
const initialState = { message: "" };
function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    serverResetPassword,
    initialState
  );
  const [email, setEmail] = useState("");
  const isValidEmail = validateEmail(email);

  useEffect(() => {
    if (state) {
      const { message } = state;
      if (message === "success") {
        router.push(
          `/account/check-email/${encodeURIComponent(email)}?action=reset`
        );
      } else if (message === "error") {
        setEmail("");
        toast.error("🤒 There was an error resetting your password.");
      }
    }
  }, [state, setEmail, email, router]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }
  return (
    <div>
      <Toaster />
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
              autoFocus
              required
            />
          </div>
          <div className="flex w-full content-center">
            <SubmitButton
              disabled={!isValidEmail}
              cssClasses={
                isValidEmail
                  ? `rounded-md bg-yellow-600 font-bold px-3 py-2 w-full text-2xl hover:bg-accent-600 active:bg-yellow-500`
                  : `rounded-md bg-primary-500 font-bold px-3 py-2 w-full text-2xl`
              }
            >
              {isPending ? <SpinnerMini /> : "Reset My Password"}
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
