import UpdatePasswordForm from "@/src/app/_components/login/UpdatePasswordForm";

function Page() {
  return (
    <div className="relative flex grid-cols-3">
      <div className="w-1/3"></div>
      <div className="text-center rounded-md py-4 bg-primary-700 w-1/3">
        <UpdatePasswordForm />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}

export default Page;
