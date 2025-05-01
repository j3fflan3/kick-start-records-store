"use client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SpinnerMini from "../spinners/SpinnerMini";
import Spinner from "../spinners/Spinner";

const SignUpCaptcha = ({ siteKey }) => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const captchaRef = useRef(null);
  const onLoad = () => {
    captchaRef.current.execute();
  };
  const disableSubmit = token === "";
  useEffect(() => {
    if (token !== "") {
      // Perform any action with the token if needed
      console.log("Captcha token:", token);
    }
  }, [token]);
  const handleSubmit = () => {
    setIsSubmitting(true);
    captchaRef.current.resetCaptcha();
    // Redirect to the signup page or perform any other action
    router.push(`/account/signup?captchaToken=${token}`);
  };

  return (
    <div className="grid-flow-row w-full box-border">
      <div
        className={`flex p-2 mt-2 justify-center ${!isSubmitting && "h-22"}`}
      >
        {!isSubmitting ? (
          <HCaptcha
            sitekey={siteKey}
            onLoad={onLoad}
            onVerify={setToken}
            ref={captchaRef}
            className="w-full"
          />
        ) : (
          <Spinner />
        )}
      </div>
      <button
        disabled={disableSubmit}
        onClick={handleSubmit}
        className={`border border-primary-700 py-2 px-4 rounded-md mx-2 text-lg font-bold inline-block ${
          !disableSubmit &&
          "hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
        }`}
      >
        Continue &rarr;
      </button>
    </div>
  );
};

export default SignUpCaptcha;
