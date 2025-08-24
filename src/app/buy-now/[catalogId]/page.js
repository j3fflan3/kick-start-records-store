import BuyNowCheckout from "@/src/app/_components/buy-now/BuyNowCheckout";
import { serverGetProduct } from "@/src/app/_library/server/product";
import Error from "@/src/app/error";

async function Page({ params }) {
  const { catalogId } = await params;
  const data = await serverGetProduct(catalogId);
  console.log(
    `buy-now/${catalogId} -> data:\n${JSON.stringify(data, null, "\t")}`
  );
  if (!data) return <Error message="Catalog item not found." />;
  return (
    <div>
      <BuyNowCheckout product={data} />
    </div>
  );
}

export default Page;
