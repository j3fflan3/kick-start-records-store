import ResetPasswordForm from "@/src/app/_components/ResetPasswordForm";

function Page() {
  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/3"></div>
      <div className="text-center rounded-md py-4 bg-primary-700 w-1/3">
        <ResetPasswordForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default Page;
