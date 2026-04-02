import { Suspense } from "react";
import { notFound } from "next/navigation";
import Spinner from "@/src/app/components/spinners/Spinner";
import { serverGetRecords } from "@/src/app/library/server/records";
import Product from "@/src/app/components/products/Product";

export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ catalogId: string }> }) {
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
