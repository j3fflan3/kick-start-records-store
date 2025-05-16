"use client";

import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";
import { useTransition } from "react";
import { useSession } from "../../_contexts/SessionProvider";
import { useShoppingCart } from "../../_contexts/ShoppingCartProvider";

function AddToCart({ catalogId, className }) {
  const { session } = useSession();
  const isAnonymous = session && session.user && session.user.is_anonymous;

  const {
    addToShoppingCart,
    localCartIds,
    setCartItem,
    cartItem,
    setCartLink,
    setOpenCart,
  } = useShoppingCart();

  const [isPending, startTransition] = useTransition();

  async function handleAddToCart(e) {
    console.log(`invoked handleAddToCart -> catalogId: ${catalogId}`);
    startTransition(async () => {
      const { data, error } = await addToShoppingCart(catalogId, isAnonymous);
      // TODO: Add error handling here.
      const addedItem = data.filter((item) => item.catalogId === catalogId);
      setCartItem(addedItem[0]);
      setCartLink("/cart");
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
