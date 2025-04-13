import { Suspense } from "react";
import RecordList from "@/src/app/_components/RecordList";
import Spinner from "@/src/app/_components/Spinner";
import ToastClient from "@/src/app/_components/ToastClient";

export const revalidate = 3600;

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
