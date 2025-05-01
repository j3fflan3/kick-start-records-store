import Spinner from "@/src/app/_components/spinners/Spinner";
import { Suspense } from "react";
import RecordList from "../_components/records/RecordList";
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
