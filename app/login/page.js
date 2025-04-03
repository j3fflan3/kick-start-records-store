import Link from "next/link";
import LoginForm from "../_components/LoginForm";

function Page() {
  return (
    <div className="relative flex grid-cols-3 login">
      <div className="w-1/3"></div>
      <div className="text-center rounded-md py-4 bg-primary-700 w-1/3">
        <h1 className="text-3xl text-primary-300 pb-1">Log In</h1>
        <p className="pb-3 text-primary-400">
          New customer?{" "}
          <Link
            href="/signup"
            className="text-primary-300 font-bold hover:text-accent-600"
          >
            Start here.
          </Link>
        </p>
        <LoginForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default Page;
