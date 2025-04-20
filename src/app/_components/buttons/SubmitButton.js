"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";

function SubmitButton({ cssClasses, disabled, children }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${cssClasses}`}
      aria-disabled={pending}
    >
      {pending ? <SpinnerMini /> : children}
    </button>
  );
}

export default SubmitButton;
