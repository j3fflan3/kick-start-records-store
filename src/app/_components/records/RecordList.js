import ComingSoonSmall from "@/src/app/_components/utilities/ComingSoonSmall";
import { serverGetRecords } from "@/src/app/_library/serverActions";
import ProductCard from "../products/ProductCard";
import AddToCartSlider from "../shopping-cart/AddToCartSlider";

export const revalidate = 0;

export default async function RecordList() {
  const records = await serverGetRecords();
  if (!records?.length) return null;
  return (
    <div>
      <ComingSoonSmall />
      <AddToCartSlider />
      <div className="grid grid-cols-1 gap-x-6 gap-y-18 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {records?.length > 0 &&
          records.map((record) => (
            <ProductCard product={record} key={record.catalogId} />
          ))}
      </div>
    </div>
  );
}
