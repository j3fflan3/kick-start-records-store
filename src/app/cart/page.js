import { Suspense } from "react";
import Cart from "@/src/app/_components/Cart";
import Spinner from "@/src/app/_components/Spinner";
import { serverGetCart } from "@/src/app/_library/serverActions";
import CartIsEmpty from "@/src/app/_components/CartIsEmpty";

export const revalidate = 0;

async function Page({ searchParams }) {
  const { guestId, cartId } = await searchParams;
  const { data } = await serverGetCart(guestId, cartId);

  if (!data) return <CartIsEmpty />;

  return (
    <Suspense fallback={<Spinner />}>
      <Cart cart={data} guestId={guestId} cartId={cartId} />
    </Suspense>
  );
}

export default Page;
