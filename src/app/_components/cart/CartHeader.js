function CartHeader() {
  return (
    <div className="flex dark:bg-primary-950 p-2 border-b dark:border-primary-800 grid-flow-row w-full">
      <div className="text-2xl ml-2 font-bold dark:text-primary-300 w-2/3">
        Shopping Cart
      </div>
      <div className="flex grow align-bottom justify-end mr-4 dark:text-primary-300 w-1/3">
        Price&nbsp;
      </div>
    </div>
  );
}

export default CartHeader;
