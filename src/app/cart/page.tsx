import CartIsEmpty from "@/src/app/components/shopping-cart/CartIsEmpty";
import Spinner from "@/src/app/components/spinners/Spinner";
import { serverGetShoppingCart } from "@/src/app/library/server/shoppingCart";
import { Suspense } from "react";
import ShoppingCart from "@/src/app/components/shopping-cart/ShoppingCart";

export const revalidate = 0;
async function Page() {
  const { data } = await serverGetShoppingCart();

  if (!data) return <CartIsEmpty />;
  console.log(data);
  return (
    <Suspense fallback={<Spinner />}>
      <ShoppingCart cart={data} />
    </Suspense>
  );
}

export default Page;
