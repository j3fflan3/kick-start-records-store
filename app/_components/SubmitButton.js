"use client";

import { useFormStatus } from "react-dom";

function SubmitButton({ cssClasses, disabled, children }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${cssClasses}`}
      aria-disabled={pending}
    >
      {children}
    </button>
  );
}

export default SubmitButton;
