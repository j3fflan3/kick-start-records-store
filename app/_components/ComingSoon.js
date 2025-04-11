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
          COMING SOON
        </div>

        <p className="pb-4 text-xl justify-center text-primary-400">
          Feel free to play around and click stuff!
        </p>
        <p className="text-justify pb-4 text-xl text-accent-50">
          Join our mailing list to get our launch date notification and a 10%
          discount code!
        </p>
        <MailingListForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default ComingSoon;
