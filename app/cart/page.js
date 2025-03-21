import { Suspense } from "react";
import Cart from "../_components/Cart";
import Spinner from "../_components/Spinner";
import { dbGetCart } from "../_library/serverActions";
import CartIsEmpty from "../_components/CartIsEmpty";

export const revalidate = 0;
// Note to self: in NextJS 14 and earlier, searchParams and params were synchronous props.
// Starting in version 15, they are async.  For back compatibility, you can still
// access them synchronously, but the behavior will be deprecated in the future.
// As soon as you upgrade to v15 or greater, change the below code to this:
/*
    const { guestId, cartId } = await searchParams;
*/
async function Page({ searchParams }) {
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
