import { cartItemCount, cartSubtotal } from "@/src/app/_library/utilities";

function CartFooter({ cart }) {
  if (!cart) return null;
  const numItems = cartItemCount(cart);
  const subTotal = cartSubtotal(cart);
  return (
    <div className="flex bg-primary-950 p-2 grid-flow-row w-full">
      <div className="flex grow align-bottom justify-end mr-4 text-primary-300 w-full text-xl m-2">
        Subtotal ({numItems} {numItems === 1 ? "item" : "items"}):&nbsp;
        <strong>${subTotal}</strong>
      </div>
    </div>
  );
}

export default CartFooter;
