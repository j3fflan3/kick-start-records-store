import { Rubik_Doodle_Shadow } from "next/font/google";
import MailingListForm from "./MailingListForm";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
function ComingSoon() {
  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/3"></div>
      <div className="relative z-10 text-center w-1/3">
        <div className="text-5xl font-bold text-primary-100 mb-5 mt-8 justify-center">
          <span className="text-justify">COMING SOON</span>
        </div>

        {/* <p className="pb-4 text-sm text-center text-primary-400">
          <span className="text-justify">
            Your favorite Metal Store is preparing for launch 🤘🏻
          </span>
          <br />
          <span className="text-sm text-center my-2 text-primary-400">
            ...and feel free to play around and randomly click stuff!
          </span>
        </p> */}
        <p className="text-justify pb-1 text-xl font-semibold text-accent-50">
          Sign up and get a 10% coupon!
          <br />
          Plus, We'll email you to let you know the day we <i>kick start</i> our
          store!
        </p>
        <MailingListForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default ComingSoon;
