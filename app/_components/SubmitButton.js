"use client";

import { useFormStatus } from "react-dom";

function SubmitButton({ cssClasses, children }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${cssClasses}`} aria-disabled={pending}>
      {children}
    </button>
  );
}

export default SubmitButton;
