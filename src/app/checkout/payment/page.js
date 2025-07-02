import Checkout from "@/src/app/_components/checkout/Checkout";
import CartIsEmpty from "@/src/app/_components/shopping-cart/CartIsEmpty";
import {
  serverGetCountries,
  serverGetShoppingCart,
} from "@/src/app/_library/serverActions";
const revalidate = 0;
async function Page() {
  const { data: cart } = await serverGetShoppingCart();
  const { data: countries } = await serverGetCountries();
  // console.log(cart);
  if (!cart) return <CartIsEmpty />;
  return (
    <div>
      <Checkout cart={cart} countries={countries} />
    </div>
  );
}

export default Page;
