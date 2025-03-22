import { Suspense } from "react";
import Checkout from "../_components/Checkout";
import Spinner from "../_components/Spinner";
import { dbGetCart } from "../_library/serverActions";
import Error from "../error";
import { notFound } from "next/navigation";

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
  console.log(`guestId: ${guestId}, cartId: ${cartId}`);
  const { data: cart, error } = await dbGetCart(guestId, cartId);
  if (error) {
    console.log(error);
    return <Error error="There was an error retrieving your cart" />;
  }
  if (!cart) {
    notFound();
  }
  // How do we want to handle expired carts?  Not sure.
  return (
    <Suspense fallback={<Spinner />}>
      <Checkout cart={cart} />
    </Suspense>
  );
}

export default Page;
