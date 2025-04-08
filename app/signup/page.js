import SignUpForm from "../_components/SignUpForm";

function Page() {
  return (
    <div className="relative flex grid-cols-4">
      <div className="w-1/4"></div>
      <div className="text-center rounded-md py-4 bg-primary-700 w-1/2">
        <h1 className="text-3xl text-primary-300 pb-4">Sign Up</h1>
        <SignUpForm />
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}

export default Page;
