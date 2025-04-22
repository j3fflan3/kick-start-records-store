import { Rubik_Doodle_Shadow } from "next/font/google";
import SignUpForm from "@/src/app/_components/signup/SignUpForm";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
function SignUp({ captchaToken }) {
  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/3"></div>
      <div className="relative z-10 text-center w-1/3">
        <div
          className={`w-full text-5xl text-center font-bold dark:text-accent-50 mb-5 mt-5 justify-center`}
        >
          SIGN UP
        </div>
        <p className="text-justify pb-0 text-xl font-semibold dark:text-primary-200">
          Sign up early for an account and get 10% off your first purchase!
        </p>
        <p className="text-justify pb-0 text-xl dark:text-primary-300">
          Plus, we&apos;ll email you to let you know the day we{" "}
          <i>kick start</i> our store!
        </p>
        <SignUpForm token={captchaToken} />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default SignUp;
