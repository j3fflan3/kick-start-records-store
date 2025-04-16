import React from "react";
import SignUpCaptcha from "@/src/app/_components/SignUpCaptcha";
import Error from "@/src/app/error";

export default function page() {
  const siteKey = process.env.NEXT_HCAPTCHA_SITEKEY;

  if (!siteKey) {
    const error = new Error("site key is missing");
    return <Error error={error} />;
  }

  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/4"></div>
      <div className="text-center rounded-md py-4 w-1/2">
        <h1 className="text-xl font-bold">Verify You Are Human</h1>
        <SignUpCaptcha siteKey={siteKey} />
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}
