"use client";

import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";
import { useCart } from "@/src/app/_contexts/CartProvider";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function AddToCart({ catalogId, className }) {
  const { session } = useSession();
  const {
    addToCart,
    localCartIds,
    setCartItem,
    cartItem,
    cartLink,
    setCartLink,
    openCart,
    setOpenCart,
  } = useCart();

  const { guestId, cartId } = localCartIds;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // This prevents a NextJS hydration error for an SSR'd client
  useEffect(() => {
    return;
    if (cartItem && cartLink && !openCart) {
      setOpenCart(true);
    }
  }, [cartItem, cartLink, openCart, setOpenCart]);

  async function handleAddToCart(e) {
    console.log("invoked handleAddToCart");
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
