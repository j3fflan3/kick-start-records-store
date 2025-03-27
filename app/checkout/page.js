import { Suspense } from "react";
import CartIsEmpty from "../_components/CartIsEmpty";
import Checkout from "../_components/Checkout";
import Spinner from "../_components/Spinner";
import { dbGetCart } from "../_library/serverActions";
import Error from "../error";

export const revalidate = 0;

async function Page(props) {
  const searchParams = await props.searchParams;
  const { guestId, cartId } = searchParams;
  // console.log(`guestId: ${guestId}, cartId: ${cartId}`);
  const { data: cart, error } = await dbGetCart(guestId, cartId);
  if (error) {
    console.log(error);
    return <Error error="There was an error retrieving your cart" />;
  }
  if (!cart) {
    return <CartIsEmpty />;
  }
  // How do we want to handle expired carts?  Not sure.
  return (
    <Suspense fallback={<Spinner />}>
      <Checkout cart={cart} />
    </Suspense>
  );
}

export default Page;
