import Checkout from "@/src/app/_components/checkout/Checkout";
import CartIsEmpty from "@/src/app/_components/shopping-cart/CartIsEmpty";
import {
  serverGetCountries,
  serverGetShoppingCart,
} from "@/src/app/_library/serverActions";
import ComingSoonSmall from "../../_components/utilities/ComingSoonSmall";
const revalidate = 0;
async function Page() {
  const { data: cart } = await serverGetShoppingCart();
  const { data: countries } = await serverGetCountries();
  // console.log(cart);
  if (!cart) return <CartIsEmpty />;
  if (process.env.HIDE_CHECKOUT === "true")
    return (
      <>
        <ComingSoonSmall />
        <div className="flex grid-cols-3">
          <div className="w-1/3"></div>
          <div className="w-1/3 text-center text-5xl mt-10">Checkout</div>
          <div className="w-1/3"></div>
        </div>
      </>
    );

  return (
    <div>
      <Checkout cart={cart} countries={countries} />
    </div>
  );
}

export default Page;
