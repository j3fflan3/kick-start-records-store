function BuyNowPaymentChoice({ setPayWith }) {
  return (
    <div className="text-center">
      <h1 className="dark:text-gray-900 text-primary-900 mb-4 text-xl">
        Pay With
      </h1>
      <button
        className="w-full p-2 outline text-lg outline-primary-400 bg-accent-700 rounded-md text-white font-bold cursor-pointer"
        onClick={() => setPayWith("card")}
      >
        Credit or Debit Card
      </button>
      <div className="divider">
        <span>OR</span>
      </div>
      <button
        className="w-full p-2 outline text-lg outline-primary-400 rounded-md text-white bg-[#181818] font-bold cursor-pointer"
        onClick={() => setPayWith("paypal")}
      >
        PayPal
      </button>
    </div>
  );
}

export default BuyNowPaymentChoice;
