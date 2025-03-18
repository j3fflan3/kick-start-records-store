import { Suspense } from "react";
import Cart from "../_components/Cart";
import Spinner from "../_components/Spinner";
import { dbGetCart } from "../_library/serverActions";

export const revalidate = 0;
export const dynamic = "force-dynamic";
// Note to self: in NextJS 14 and earlier, searchParams and params were synchronous props.
// Starting in version 15, they are async.  For back compatibility, you can still
// access them synchronously, but the behavior will be deprecated in the future.
// As soon as you upgrade to v15 or greater, change the below code to this:
/*
    const { guestId, cartId } = await searchParams;
*/
async function Page({ searchParams }) {
  const { guestId, cartId } = searchParams;
  // NOTE: Why does supabase rpc return a top level object called data?
  const response = await dbGetCart(guestId, cartId);
  console.log(response);
  return (
    <Suspense fallback={<Spinner />}>
      <Cart cart={response.data} />
    </Suspense>
  );
}

export default Page;
