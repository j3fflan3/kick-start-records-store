"use client";

import { serverGetShoppingCart } from "@/src/app/_library/serverActions";
import Error from "@/src/app/error";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect } from "react";
import { useShoppingCart } from "../../_contexts/ShoppingCartProvider";

export const revalidate = 0;

function CartIcon() {
  const context = useShoppingCart();
  const { cartCount: itemCount, setCartCount, localCartIds } = context;
  useEffect(
    function () {
      async function getCartCount() {
        const { data, error } = await serverGetShoppingCart();
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

      getCartCount();
    },
    [setCartCount]
  );
  // Need to figure out if there is a way to avoid this hydration warning in the first place
  return (
    <Link suppressHydrationWarning={true} href="/cart">
      <div className="shoppingCartContainer">
        <div className="shoppingCartIcon ">
          <ShoppingCartIcon
            title="Cart"
            className="shoppingCartIcon h-11  w-11  text-primary-200 z-50"
          />
        </div>

        <div className="shoppingCartCount">
          <div className=" text-center align-top w-8">
            <span className="text-accent-600 text-lg">
              <strong>{itemCount}</strong>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CartIcon;
