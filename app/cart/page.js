import { Suspense } from "react";
import Cart from "../_components/Cart";
import Spinner from "../_components/Spinner";
import { dbGetCart } from "../_library/serverActions";
import CartIsEmpty from "../_components/CartIsEmpty";

export const revalidate = 0;

async function Page({ props }) {
  const searchParams = await props.searchParams;
  const { guestId, cartId } = searchParams;
  const { data } = await dbGetCart(guestId, cartId);
  // How do we want to handle expired carts?  Not sure.
  if (!data) return <CartIsEmpty />;
  return (
    <Suspense fallback={<Spinner />}>
      <Cart cart={data} guestId={guestId} cartId={cartId} />
    </Suspense>
  );
}

export default Page;
