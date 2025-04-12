import { Suspense } from "react";
import RecordList from "./_components/RecordList";
import Spinner from "./_components/Spinner";
import ToastClient from "./_components/ToastClient";
import ComingSoon from "./_components/SignUp";
import ComingSoonSmall from "./_components/ComingSoonSmall";
export const revalidate = 30;
export default async function Home({ searchParams }) {
  const { signup_success } = await searchParams;
  const signupMessage = "You've successfully confirmed your signup!";
  const toastOptions = {
    id: "signup",
    icon: "✅",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  };
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <RecordList />
      </Suspense>

      {signup_success && (
        <ToastClient message={signupMessage} options={toastOptions} />
      )}
    </div>
  );
}
