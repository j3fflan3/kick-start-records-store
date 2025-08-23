import BuyNowCheckout from "@/src/app/_components/buy-now/BuyNowCheckout";
import { serverGetRecords } from "../../_library/server/records";
import Error from "../../error";

async function Page({ params }) {
  const { catalogId } = await params;
  const data = await serverGetRecords(catalogId, 1);
  if (!data) return <Error message="Catalog item not found." />;
  return (
    <div>
      <BuyNowCheckout product={data} />
    </div>
  );
}

export default Page;
