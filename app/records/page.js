import { Suspense } from "react";
import Spinner from "../_components/Spinner";
import RecordList from "../_components/RecordList";
export const revalidate = 60;
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
