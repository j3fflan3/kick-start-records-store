import PayPalCheckout from "@/src/app/components/paypal/PayPalCheckout";
import CartIsEmpty from "@/src/app/components/shopping-cart/CartIsEmpty";
import { serverGetShoppingCart } from "@/src/app/library/server/shoppingCart";
import { getCountries } from "@/src/app/library/server/countries";

import ComingSoonSmall from "@/src/app/components/utilities/ComingSoonSmall";
export const revalidate = 0;
async function Page() {
  const { data: cart } = await serverGetShoppingCart();
  const { data: countries } = await getCountries();
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
      {/* <Checkout cart={cart} countries={countries} /> */}
      <PayPalCheckout cart={cart} countries={countries} />
    </div>
  );
}

export default Page;
