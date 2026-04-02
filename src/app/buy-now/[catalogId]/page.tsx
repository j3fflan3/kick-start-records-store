import BuyNowCheckout from "@/src/app/components/buy-now/BuyNowCheckout";
import { serverGetBuyNowProduct } from "@/src/app/library/server/product";
import { getCountries } from "@/src/app/library/server/countries";
import Error from "@/src/app/error";
import { Suspense } from "react";
import Spinner from "../../components/spinners/Spinner";
export const revalidate = 0;

async function Page({ params }: { params: Promise<{ catalogId: string }> }) {
  const { catalogId } = await params;
  const { data } = await serverGetBuyNowProduct(catalogId);
  const { data: countries } = await getCountries();
  console.log(
    `buy-now/${catalogId} -> data:\n${JSON.stringify(data, null, 2)}`
  );
  if (!data) return <Error message="Catalog item not found." />;
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <BuyNowCheckout product={data} countries={countries} />
      </Suspense>
    </div>
  );
}

export default Page;
