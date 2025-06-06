import Checkout from "../../_components/Checkout/Checkout";
import CartIsEmpty from "../../_components/shopping-cart/CartIsEmpty";
import {
  serverGetCountries,
  serverGetShoppingCart,
} from "../../_library/serverActions";

async function Page() {
  const { data: cart } = await serverGetShoppingCart();
  const { data: countries } = await serverGetCountries();
  console.log(cart);
  if (!cart) return <CartIsEmpty />;
  return (
    <div>
      <Checkout cart={cart} countries={countries} />
    </div>
  );
}

export default Page;
