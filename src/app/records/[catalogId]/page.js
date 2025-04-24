import { notFound } from "next/navigation";
import { Suspense } from "react";
import Record from "@/src/app/_components/records/Record";
import Spinner from "@/src/app/_components/spinners/Spinner";
import { serverGetRecords } from "@/src/app/_library/serverActions";
import Product from "../../_components/products/Product";

export const revalidate = 3600;

export default async function Page({ params }) {
  const { catalogId } = await params;
  const records = await serverGetRecords(catalogId, 1);
  if (!records.length) return notFound();
  const record = records.at(0);
  return (
    <div className="max-w-6xl mx-auto mt-1">
      <Suspense fallback={<Spinner />} key={"abc"}>
        <Product record={record} key={record.catalogId} />
      </Suspense>
    </div>
  );
}
