import BuyNowCheckout from "@/src/app/_components/buy-now/BuyNowCheckout";
import { serverGetBuyNowProduct } from "@/src/app/_library/server/product";
import Error from "@/src/app/error";
import { Suspense } from "react";
import Spinner from "../../_components/spinners/Spinner";
export const revalidate = 0;

async function Page({ params }) {
  const { catalogId } = await params;
  const { data } = await serverGetBuyNowProduct(catalogId);
  console.log(
    `buy-now/${catalogId} -> data:\n${JSON.stringify(data, null, "\t")}`
  );
  if (!data) return <Error message="Catalog item not found." />;
  return (
    <div>
      <Suspense fallback={<Spinner />} key={"abc"}>
        <BuyNowCheckout product={data} />
      </Suspense>
    </div>
  );
}

export default Page;
