import CartItem from "./CartItem";

function Checkout({ cart }) {
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
