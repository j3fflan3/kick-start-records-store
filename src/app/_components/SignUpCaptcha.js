"use client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SignUpCaptcha = ({ siteKey }) => {
  const [token, setToken] = useState("");
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
    if (token !== "") {
      captchaRef.current.resetCaptcha();
      // Redirect to the signup page or perform any other action
      router.push(`/account/signup?captchaToken=${token}`);
    } else {
      toast.error(
        "There was an error. Please complete the captcha to proceed."
      );
    }
  };

  return (
    <>
      <Toaster />
      <div className="grid-flow-row w-full box-border">
        <div className="flex p-2 mt-2 justify-center">
          <HCaptcha
            sitekey={siteKey}
            onLoad={onLoad}
            onVerify={setToken}
            ref={captchaRef}
            className="w-full"
          />
          {/* <input
            type="hidden"
            name="captchaToken"
            value={token}
            readOnly={true}
          /> */}
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
    </>
  );
};

export default SignUpCaptcha;
