import Link from "next/link";
import LoginForm from "@/app/_components/LoginForm";
import ComingSoonSmall from "@/app/_components/ComingSoonSmall";

function Page() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div>
      {isDev && <ComingSoonSmall showSignUp={true} />}
      <div className="relative flex grid-cols-3">
        <div className="w-1/3"></div>
        <div className="text-center rounded-md py-4 w-1/3">
          <h1 className="text-5xl text-primary-300 pb-5">Log In</h1>
          <p className="pb-1 text-primary-400">
            New customer?{" "}
            <Link
              href="/signup"
              className="text-primary-300 font-bold hover:text-accent-600"
            >
              Start here.
            </Link>
          </p>
          <LoginForm />
          <p className="text-primary-200 pt-3">
            Forgot your password?&nbsp;
            <Link
              href="/account/reset-password"
              className="text-primary-300 font-bold hover:text-accent-600"
            >
              Click here.
            </Link>
          </p>
        </div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
}

export default Page;
