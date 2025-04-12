import { notFound } from "next/navigation";
import { Suspense } from "react";
import Record from "@/src/app/_components/Record";
import Spinner from "@/src/app/_components/Spinner";
import { serverGetRecords } from "@/src/app/_library/serverActions";

export const revalidate = 0;

export default async function Page({ params }) {
  const { catalogId } = await params;
  const records = await serverGetRecords(catalogId, 10);
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
