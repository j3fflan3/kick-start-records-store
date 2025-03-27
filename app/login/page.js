import Link from "next/link";

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
        <form>
          <div className="grid-flow-row">
            <div className="form-row">
              <label htmlFor="email">Email:&nbsp;</label>
              <input id="email" type="email" className="rounded-md" />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password:&nbsp;</label>
              <input id="password" type="password" className="rounded-md" />
            </div>
            <div className="">
              <button className="rounded-md bg-yellow-600 font-bold p-2 w-1/2 hover:bg-accent-600 active:bg-yellow-500">
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default Page;
