import Link from "next/link";
import LoginForm from "@/src/app/_components/LoginForm";
import { Rubik_Doodle_Shadow } from "next/font/google";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["symbols"],
});
function Page() {
  return (
    <div>
      <div className="relative flex grid-cols-3">
        <div className="w-1/3"></div>
        <div className="text-center rounded-md py-4 w-1/3">
          <h1
            className={`text-5xl text-accent-500 pb-5 ${rubikDoodleShadow.className}`}
          >
            Log In
          </h1>
          <p className="pb-1 text-primary-200">
            New customer?{" "}
            <Link
              href="/account/signup"
              className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
            >
              Start here &rarr;
            </Link>
          </p>
          <LoginForm />
          <p className="text-primary-200 pt-3">
            Forgot your password?&nbsp;
            <Link
              href="/account/reset-password"
              className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
            >
              Reset Password &rarr;
            </Link>
          </p>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
}

export default Page;
