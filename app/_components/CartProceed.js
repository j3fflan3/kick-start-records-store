import Link from "next/link";
import { cartItemCount, cartSubtotal } from "../_library/utilities";

function CartProceed({ cart, guestId, cartId }) {
  if (!cart) return null;
  const numItems = cartItemCount(cart);
  const subTotal = cartSubtotal(cart);
  return (
    <div className="text-center p-2">
      <div className="text-xl m-2">
        Subtotal ({numItems} {numItems === 1 ? "item" : "items"}):{" "}
        <strong>${subTotal}</strong>
      </div>
      <Link
        href={`/checkout?guestId=${guestId}&cartId=${cartId}`}
        className="bg-accent-500 p-2 font-bold m-2 rounded-md cursor-pointer active:bg-accent-200 active:text-primary-800"
      >
        Proceed to Checkout &rarr;
      </Link>
    </div>
  );
}

export default CartProceed;
