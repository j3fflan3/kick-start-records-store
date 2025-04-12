import { Rubik_Doodle_Shadow } from "next/font/google";
import MailingListForm from "@/src/app/_components/SignUpForm";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
function SignUp() {
  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/3"></div>
      <div className="relative z-10 text-center w-1/3">
        <div
          className={`w-full text-5xl text-center font-bold text-accent-500 mb-5 mt-5 justify-center ${rubikDoodleShadow.className}`}
        >
          SIGN UP
        </div>
        <p className="text-justify pb-0 text-xl font-semibold text-primary-200">
          Sign up early for an account and get a 10% coupon!
        </p>
        <p className="text-justify pb-0 text-xl text-primary-300">
          Plus, we'll email you to let you know the day we <i>kick start</i> our
          store!
        </p>
        <MailingListForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default SignUp;
