"use client";

import SubmitButton from "@/src/app/_components/buttons/SubmitButton";
import {
  serverResend,
  serverResetPassword,
} from "@/src/app/_library/serverActions";
import { useActionState } from "react";

function ResendConfirmation({ email, action }) {
  // this needs to display a message to the user
  // that the confirmation email has been sent
  // and to check their email
  // and to check their spam folder
  // and to check their junk folder
  // and to check their promotions folder
  // and to check their social folder

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
  return (
    <form action={formAction} className="w-full content-center">
      <input type="hidden" name="email" value={email} />
      <SubmitButton
        disabled={isPending || !serverAction}
        cssClasses="bg-accent-700 mb-3 mt-3 mr-4 px-3 py-2 font-bold h-[40px] text-primary-50  text-lg/6 border-primary-500 rounded-md"
      >
        Resend Confirmation
      </SubmitButton>
    </form>
  );
}

export default ResendConfirmation;
