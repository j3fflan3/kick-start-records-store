"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "@/src/app/components/spinners/SpinnerMini";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  cssClasses?: string;
  disabled?: boolean;
  showPending?: boolean;
  children: React.ReactNode;
}

function SubmitButton({
  cssClasses,
  disabled,
  showPending,
  children,
  ...props
}: SubmitButtonProps) {
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
