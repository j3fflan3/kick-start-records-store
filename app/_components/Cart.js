import { subtotal } from "../_library/utilities";
import CartItem from "./CartItem";

function Cart({ cart }) {
  return (
    <div className="grid grid-rows-1 m-1 w-full">
      {cart.map((item) => (
        <CartItem key={item.catalogId} item={item} />
      ))}
      <span>Subtotal: ${subtotal(cart)}</span>
    </div>
  );
}

export default Cart;
