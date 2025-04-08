"use client";

import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../_contexts/CartProvider";
import SpinnerMini from "./SpinnerMini";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AddToCartToast from "./AddToCartToast";

function AddToCart({ catalogId }) {
  const { addToCart, localCartIds } = useCart();
  const [isClient, setIsClient] = useState(false);
  const { guestId, cartId } = localCartIds;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // This prevents a NextJS hydration error for an SSR'd client
  useEffect(() => {
    setIsClient(true);
  }, []);

  async function handleAddToCart() {
    startTransition(async () => {
      const { data, error } = await addToCart(catalogId);
      // console.log(data);
      const item = data.filter((item) => item.catalogId === catalogId);
      // console.log(item);
      toast.custom((t) => (
        <AddToCartToast
          item={item[0]}
          handleCartClick={() => {
            toast.dismiss(t.id);
            router.push(`/cart?guestId=${guestId}&cartId=${cartId}`);
          }}
          cssClasses={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-primary-700 shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        />
      ));
    });
  }
  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className="bg-accent-700 mb-3 mt-3 mr-4 ml-4 px-3 py-1  border-primary-500 rounded-md"
      >
        {isPending ? <SpinnerMini /> : <span>Add To Cart</span>}
      </button>
      {isClient && <Toaster position="top-center" reverseOrder={false} />}
    </>
  );
}

export default AddToCart;
