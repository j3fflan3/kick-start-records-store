"use client";

import AddToCartToast from "@/src/app/_components/cart/AddToCartToast";
import SpinnerMini from "@/src/app/_components/spinners/SpinnerMini";
import { useCart } from "@/src/app/_contexts/CartProvider";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";

function AddToCart({ catalogId, className }) {
  const { session } = useSession();
  const { addToCart, localCartIds } = useCart();
  const [isClient, setIsClient] = useState(false);
  const { guestId, cartId } = localCartIds;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // This prevents a NextJS hydration error for an SSR'd client
  useEffect(() => {
    setIsClient(true);
  }, []);

  async function handleAddToCart(e) {
    console.log("invoked handleAddToCart");
    startTransition(async () => {
      const { data, error } = await addToCart(catalogId);
      const item = data.filter((item) => item.catalogId === catalogId);
      console.log(`AddToCart item: ${JSON.stringify(item)}`);
      // Toast is launching the window twice.  Figure out why.
      toast.custom(
        (t) => {
          console.log("invoked toast addToCart");
          return (
            <AddToCartToast
              item={item[0]}
              handleCartClick={() => {
                toast.dismiss(t.id);
                router.push(`/cart?guestId=${guestId}&cartId=${cartId}`);
              }}
              handleClose={() => {
                toast.dismiss(t.id);
              }}
              cssClasses={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-primary-800 border-primary-600 border-2 shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            />
          );
        },
        {
          id: "addToCart",
          removeDelay: 100,
          duration: 3000,
        }
      );
    });
  }
  return (
    // "bg-accent-700 mb-3 mt-3 mr-4 px-3 py-2 w-[108.5px] h-[40px] border-primary-500 rounded-md"
    <>
      {isClient && <Toaster position="top-center" reverseOrder={false} />}
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
