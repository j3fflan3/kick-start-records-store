import { dbGetRecords } from "../_library/serverActions";
import RecordCard from "./RecordCard";

export const revalidate = 0;

export default async function RecordList() {
  const records = await dbGetRecords();
  if (!records.length) return null;
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {records?.length > 0 &&
        records.map((record) => (
          <RecordCard record={record} key={record.catalogId} />
        ))}
    </div>
  );
}
