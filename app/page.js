import { Suspense } from "react";
import RecordList from "./_components/RecordList";
import Spinner from "./_components/Spinner";
import ToastMessenger from "./_components/ToastMessenger";
export const revalidate = 30;
export default async function Home({ searchParams }) {
  const { signup_success } = await searchParams;
  // if (signup_success) toast("You've successfully confirmed your signup!");
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <RecordList />
      </Suspense>
      {signup_success && (
        <ToastMessenger>
          You&apos;ve successfully confirmed your signup!
        </ToastMessenger>
      )}
    </div>
  );
}
