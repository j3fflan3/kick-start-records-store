import CartItem from "@/src/app/_components/cart/CartItem";
import ComingSoonSmall from "@/src/app/_components/ComingSoonSmall";

function Checkout({ cart }) {
  return (
    <ComingSoonSmall />
    // <div>
    //   <div>Checkout</div>
    //   <div>Delivery Instructions</div>
    //   <div>Payment Instructions</div>
    //   <div className="w-full h-full text-left bg-primary-800 rounded-sm">
    //     {cart.map((item) => (
    //       <CartItem key={item.catalogId} item={item} />
    //     ))}
    //   </div>
    // </div>
  );
}

export default Checkout;
