import CartItem from "./CartItem";
import ComingSoonSmall from "./ComingSoonSmall";

function Checkout({ cart }) {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) return <ComingSoonSmall showSignUp={true} />;
  return (
    <div>
      <div>Checkout</div>
      <div>Delivery Instructions</div>
      <div>Payment Instructions</div>
      <div className="w-full h-full text-left bg-primary-800 rounded-sm">
        {cart.map((item) => (
          <CartItem key={item.catalogId} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Checkout;
