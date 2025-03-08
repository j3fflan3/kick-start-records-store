import Image from "next/image";
import RecordList from "./_components/RecordList";
import { Suspense } from "react";
import Spinner from "./_components/Spinner";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <RecordList />
      </Suspense>
    </div>
  );
}
