"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";

function SubmitButton({
  cssClasses,
  disabled,
  showPending,
  children,
  ...props
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={disabled}
      className={`${cssClasses}`}
      aria-disabled={pending}
      {...props}
    >
      {pending || showPending ? <SpinnerMini /> : children}
    </button>
  );
}

export default SubmitButton;
