function Checkout({ cart }) {
  return (
    <div className="flex grid-cols-3">
      <div className="xs:hidden sm:w-1/5"></div>
      <div className="w-full sm:w-3/5 text-center text-3xl sm:text-5xl mt-10">
        Checkout
      </div>
      <div className="xs:hidden sm:w-1/5"></div>
    </div>
  );
}

export default Checkout;
