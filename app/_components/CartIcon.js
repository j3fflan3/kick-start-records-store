"use client";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useCart } from "../_contexts/CartProvider";
import { useEffect } from "react";
import Link from "next/link";
import { dbGetCart } from "../_library/serverActions";
import Error from "../error";

export const revalidate = 0;

function CartIcon() {
  const context = useCart();
  const {
    cartCount: itemCount,
    getCartCount,
    setCartCount,
    localCartIds,
  } = context;
  const { guestId, cartId } = localCartIds;
  useEffect(
    function () {
      async function getCartCount(guestId, cartId) {
        if (!guestId || !cartId) return;
        const { data, error } = await dbGetCart(guestId, cartId);
        if (error) {
          console.log(error);
          return <Error error={"There was a problem updating the cart."} />;
        }
        if (!data) return;
        const newCartCount = data.reduce((sum, item) => sum + item.count, 0);
        try {
          setCartCount(newCartCount);
        } catch (error) {
          console.log(error);
        }
      }

      getCartCount(guestId, cartId);
    },
    [setCartCount, guestId, cartId]
  );
  // Need to figure out if there is a way to avoid this hydration warning in the first place
  return (
    <Link
      suppressHydrationWarning={true}
      href={`/cart?guestId=${guestId}&cartId=${cartId}`}
    >
      <div className="shoppingCartContainer">
        <div className="shoppingCartIcon ">
          <ShoppingCartIcon
            title="Cart"
            className="shoppingCartIcon h-11  w-11  text-primary-200 z-50"
          />
        </div>
        {itemCount > 0 && (
          <div className="shoppingCartCount">
            <div className=" text-center align-top w-8">
              <span className="text-accent-700 text-lg">
                <strong>{itemCount}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default CartIcon;
