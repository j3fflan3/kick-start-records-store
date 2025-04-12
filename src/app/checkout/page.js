import { Suspense } from "react";
import CartIsEmpty from "@/src/app/_components/CartIsEmpty";
import Checkout from "@/src/app/_components/Checkout";
import Spinner from "@/src/app/_components/Spinner";
import { serverGetCart } from "@/src/app/_library/serverActions";
import Error from "@/src/app/error";

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
