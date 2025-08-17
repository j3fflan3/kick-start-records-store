import CartIsEmpty from "@/src/app/_components/shopping-cart/CartIsEmpty";
import Checkout from "@/src/app/_components/checkout/Checkout";
import Spinner from "@/src/app/_components/spinners/Spinner";
import { serverGetShoppingCart } from "@/src/app/_library/server/shoppingCart";
import Error from "@/src/app/error";
import { Suspense } from "react";

export const revalidate = 0;

async function Page() {
  const { data: cart, error } = await serverGetShoppingCart();
  console.log(cart);
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
