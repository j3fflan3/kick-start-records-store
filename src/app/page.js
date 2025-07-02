import RecordList from "@/src/app/_components/records/RecordList";
import Spinner from "@/src/app/_components/spinners/Spinner";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function Home() {
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <RecordList />
      </Suspense>
    </div>
  );
}
