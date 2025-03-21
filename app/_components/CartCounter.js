"use client";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useCart } from "../_contexts/CartProvider";

const revalidate = 0;

function CartCounter({ count, catalogId }) {
  const { updateCart, cartCount, setCartCount } = useCart();
  const [isPending, startTransition] = useTransition();
  async function handleUpdateCart(count) {
    startTransition(async () => {
      console.log("CartCounter: calling updateCart");
      await updateCart(catalogId, count);
      console.log("CartCounter: end of updateCart");
    });
  }
  console.log(`Loading CartCounter -> catalogId:${catalogId}, count:${count}`);
  return (
    <div className="border-accent-500 border-2 rounded-lg px-3 py-1 relative">
      <button
        className="cursor-pointer"
        onClick={() => {
          handleUpdateCart(count - 1);
        }}
        disabled={isPending}
      >
        {count === 1 ? (
          <TrashIcon className="size-3 text-accent-500" />
        ) : (
          <MinusIcon className="size-3 text-primary-100" />
        )}
      </button>
      {/* <span className="px-2">{count}</span> */}
      <div className="inline-block h-6 w-8 aspect-square text-center">
        {isPending ? (
          <span className="cart-count">
            <SpinnerMini />
          </span>
        ) : (
          <span className="cart-count">{count}</span>
        )}
      </div>
      <button
        className="cursor-pointer"
        onClick={() => {
          handleUpdateCart(count + 1);
        }}
        disabled={isPending}
      >
        <PlusIcon className="size-3 text-primary-100" />
      </button>
    </div>
  );
}

export default CartCounter;
