import Record from "@/app/_components/Record";
import Spinner from "@/app/_components/Spinner";
import { getRecords } from "@/app/_library/dataService";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 0;

export default async function Page({ params }) {
  const { catalogId } = params;
  const records = await getRecords(catalogId, 10);
  if (!records.length) return notFound();
  return (
    <div className="max-w-6xl mx-auto mt-1">
      <Suspense fallback={<Spinner />} key={"abc"}>
        {records.map((record) => (
          <Record record={record} key={record.catalogId} />
        ))}
      </Suspense>
    </div>
  );
}
