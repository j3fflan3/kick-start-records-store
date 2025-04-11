import { serverGetRecords } from "@/app/_library/serverActions";
import RecordCard from "./RecordCard";
import ComingSoonSmall from "./ComingSoonSmall";

export const revalidate = 0;

export default async function RecordList() {
  const records = await serverGetRecords();
  if (!records?.length) return null;
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div>
      {isDev && <ComingSoonSmall showSignUp={true} />}
      <div className="grid sm:grid-cols-1 sm:gap-2 md:grid-cols-1 md:gap-2 lg:grid-cols-2 lg:gap-12 xl:gap-14">
        {records?.length > 0 &&
          records.map((record) => (
            <RecordCard record={record} key={record.catalogId} />
          ))}
      </div>
    </div>
  );
}
