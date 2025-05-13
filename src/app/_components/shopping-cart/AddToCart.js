"use client";

import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";
import { useCart } from "@/src/app/_contexts/CartProvider";
import { useTransition } from "react";
import { useAnonymousSessionCart } from "../../_hooks/useAnonymousSessionCart";

function AddToCart({ catalogId, className }) {
  const { user, resetAnonymousSessionCart } = useAnonymousSessionCart();
  console.log(`user: ${user && JSON.stringify(user)}`);
  const {
    addToCart,
    localCartIds,
    setCartItem,
    cartItem,
    setCartLink,
    setOpenCart,
  } = useCart();

  const { guestId, cartId } = localCartIds;
  const [isPending, startTransition] = useTransition();

  async function handleAddToCart(e) {
    console.log(`invoked handleAddToCart -> catalogId: ${catalogId}`);
    startTransition(async () => {
      const { data, error } = await addToCart(catalogId);
      const addedItem = data.filter((item) => item.catalogId === catalogId);
      setCartItem(addedItem[0]);
      setCartLink(`/cart?guestId=${guestId}&cartId=${cartId}`);
      console.log(`AddToCart item: ${JSON.stringify(cartItem)}`);
      setOpenCart(true);
    });
  }
  return (
    // "bg-accent-700 mb-3 mt-3 mr-4 px-3 py-2 w-[108.5px] h-[40px] border-primary-500 rounded-md"
    <>
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className={className}
      >
        {isPending ? (
          <SpinnerMini />
        ) : (
          <span className="dark:text-white">Add To Cart</span>
        )}
      </button>
    </>
  );
}

export default AddToCart;
