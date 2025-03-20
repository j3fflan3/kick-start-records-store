import { subtotal } from "../_library/utilities";
import CartItem from "./CartItem";
import CartProceed from "./CartProceed";

function Cart({ cart }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <div className="grid grid-rows-1 w-full col-span-2 ">
        {cart.map((item) => (
          <CartItem key={item.catalogId} item={item} />
        ))}
      </div>
      <div className="w-full h-full text-left m-1 bg-primary-800 rounded-sm">
        <CartProceed cart={cart} />
      </div>
    </div>
  );
}

export default Cart;
