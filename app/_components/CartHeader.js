import { ShoppingCartIcon } from "@heroicons/react/24/solid";

function CartHeader() {
  return (
    <div className="flex bg-primary-800 p-2 border-b border-primary-700 grid-flow-row w-full">
      <div className="text-2xl ml-2 font-bold text-primary-300 w-2/3">
        Shopping Cart
      </div>
      <div className="flex grow align-bottom justify-end mr-4 text-primary-300 w-1/3">
        Price&nbsp;
      </div>
    </div>
  );
}

export default CartHeader;
