import CartFooter from "@/src/app/_components/CartFooter";
import CartHeader from "@/src/app/_components/CartHeader";
import CartItem from "@/src/app/_components/CartItem";
import CartProceed from "@/src/app/_components/CartProceed";

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
      <div className="w-full h-full text-left bg-primary-950 rounded-sm">
        <CartProceed cart={cart} guestId={guestId} cartId={cartId} />
      </div>
    </div>
  );
}

export default Cart;
