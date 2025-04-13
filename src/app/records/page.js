import { Suspense } from "react";
import Spinner from "@/src/app/_components/Spinner";
import RecordList from "@/src/app/_components/RecordList";
export const revalidate = 3600;
function Page() {
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <RecordList />
      </Suspense>
    </div>
  );
}

export default Page;
