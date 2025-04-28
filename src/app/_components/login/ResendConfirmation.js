"use client";

import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import {
  serverResend,
  serverResetPassword,
} from "@/src/app/_library/serverActions";
import { useActionState, useEffect, useState } from "react";

function ResendConfirmation({ email, action, children }) {
  const [message, setMessage] = useState("");

  let serverAction = null;
  switch (action) {
    case "signup":
      serverAction = serverResend;
      break;
    case "reset":
      serverAction = serverResetPassword;
      break;
    default:
      console.log(`ResendConfirmation: action ${action} not found`);
  }
  console.log(serverAction?.name);
  const [state, formAction, isPending] = useActionState(serverAction, {});
  useEffect(() => {
    if (state && state?.message) {
      setMessage(state.message);
    }
  }, [state, setMessage]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 mb-4 text-center text-xl/9 font-bold tracking-tight dark:text-white">
          We sent an confirmation email to {email}
        </h2>
        {children}
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action={formAction} className="w-full content-center">
          <input type="hidden" name="email" value={email} />
          <SubmitButton
            disabled={isPending || !serverAction}
            cssClasses="bg-accent-700 mb-3 mt-0 mr-4 px-3 py-2 font-bold h-[40px] text-primary-50 w-full text-lg/6 border-primary-500 hover:cursor-pointer rounded-md"
          >
            Resend Confirmation
          </SubmitButton>
          {message !== "" && (
            <p className="text-left pb-0 text-lg font-medium dark:text-primary-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResendConfirmation;
