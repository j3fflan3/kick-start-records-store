"use client";

import SignUpFormShort from "./SignUpFormShort";

function SignUpShort({ captchaToken }) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-left text-2xl/9 font-bold tracking-tight dark:text-white">
          New Customers
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpFormShort token={captchaToken} />
      </div>
    </div>
  );
}

export default SignUpShort;
