"use client";

import SignUpForm from "./SignUpForm";

function SignUp({ captchaToken }) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
          Sign up
        </h2>
        <p className="text-justify pb-0 text-lg font-semibold dark:text-primary-200">
          Sign up early for an account and get 10% off your first purchase!
        </p>
        {/* <p className="text-justify pb-0 text-lg dark:text-primary-300">
          Plus, we&apos;ll email you to let you know the day we{" "}
          <i>kick start</i> our store!
        </p> */}
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignUpForm token={captchaToken} />
      </div>
    </div>
  );
}

export default SignUp;
