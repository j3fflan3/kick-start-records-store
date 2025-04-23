import CartIsEmpty from "@/src/app/_components/cart/CartIsEmpty";
import Spinner from "@/src/app/_components/spinners/Spinner";
import { serverGetCart } from "@/src/app/_library/serverActions";
import { Suspense } from "react";
import ShoppingCart from "../_components/shopping-cart/ShoppingCart";

export const revalidate = 0;

async function Page({ searchParams }) {
  const { guestId, cartId } = await searchParams;
  const { data } = await serverGetCart(guestId, cartId);

  if (!data) return <CartIsEmpty />;
  // console.log(data);
  return (
    <Suspense fallback={<Spinner />}>
      <ShoppingCart cart={data} guestId={guestId} cartId={cartId} />
    </Suspense>
  );
}

export default Page;
