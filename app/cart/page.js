import { Suspense } from "react";
import Cart from "../_components/Cart";
import Spinner from "../_components/Spinner";
import { serverGetCart } from "@/app/_library/serverActions";
import CartIsEmpty from "../_components/CartIsEmpty";

export const revalidate = 0;

async function Page({ searchParams }) {
  const { guestId, cartId } = await searchParams;
  const { data } = await serverGetCart(guestId, cartId);
  // How do we want to handle expired carts?  Not sure.
  if (!data) return <CartIsEmpty />;
  return (
    <Suspense fallback={<Spinner />}>
      <Cart cart={data} guestId={guestId} cartId={cartId} />
    </Suspense>
  );
}

export default Page;
