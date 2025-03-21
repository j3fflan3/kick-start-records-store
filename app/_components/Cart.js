import CartFooter from "./CartFooter";
import CartHeader from "./CartHeader";
import CartItem from "./CartItem";
import CartProceed from "./CartProceed";

function Cart({ cart, guestId, cartId }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <div className="grid grid-rows-1 w-full col-span-2 ">
        <CartHeader />
        {cart.map((item) => (
          <CartItem key={item.catalogId} item={item} />
        ))}
        <CartFooter cart={cart} />
      </div>
      <div className="w-full h-full text-left bg-primary-800 rounded-sm">
        <CartProceed cart={cart} guestId={guestId} cartId={cartId} />
      </div>
    </div>
  );
}

export default Cart;
