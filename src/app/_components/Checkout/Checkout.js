"use client";

import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { cartItemsWeight } from "@/src/app/_library/utilities";
import { useShippingCalculator } from "@/src/app/_hooks/useShippingCalculator";

function Checkout({ cart }) {
  // const []
  const { cartCount } = useShoppingCart();
  const weight = cartItemsWeight(cart);
  // Using temporary hard coded values to test until forms are wired up.
  const { shippingCost, shippingError } = useShippingCalculator(
    cartCount,
    weight,
    "92339",
    "80005"
  );

  const cartJson = cart ? JSON.stringify(cart) : "";
  console.log(
    `shippingCost: ${shippingCost && shippingCost}, shippingError: ${
      shippingError && shippingError
    }, cartJson: ${cartJson}`
  );
  return (
    <div className="flex grid-cols-3">
      <div className="xs:hidden sm:w-1/5"></div>
      <div className="w-full sm:w-3/5 text-center text-3xl sm:text-5xl mt-10">
        Checkout
      </div>
      <div className="xs:hidden sm:w-1/5"></div>
    </div>
  );
}

export default Checkout;
