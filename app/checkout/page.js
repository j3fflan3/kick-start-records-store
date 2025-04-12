import { Suspense } from "react";
import CartIsEmpty from "../_components/CartIsEmpty";
import Checkout from "../_components/Checkout";
import Spinner from "../_components/Spinner";
import { serverGetCart } from "@/app/_library/serverActions";
import Error from "../error";

export const revalidate = 0;

async function Page({ searchParams }) {
  const { guestId, cartId } = await searchParams;
  // console.log(`guestId: ${guestId}, cartId: ${cartId}`);
  const { data: cart, error } = await serverGetCart(guestId, cartId);
  if (error) {
    console.log(error);
    return <Error error="There was an error retrieving your cart" />;
  }
  if (!cart) {
    return <CartIsEmpty />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Checkout cart={cart} />
    </Suspense>
  );
}

export default Page;
