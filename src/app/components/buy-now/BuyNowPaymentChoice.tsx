interface BuyNowPaymentChoiceProps {
  setPayWith: (value: string) => void;
}

function BuyNowPaymentChoice({ setPayWith }: BuyNowPaymentChoiceProps) {
  return (
    <div className="text-center mr-3.5">
      <h1 className="dark:text-gray-900 text-primary-900 mb-4 text-xl !text-left ml-2">
        Pay With
      </h1>
      <button
        className="w-full ml-2 p-2 outline text-lg outline-primary-400 bg-accent-700 rounded-md text-white font-bold cursor-pointer"
        onClick={() => setPayWith("card")}
      >
        Credit or Debit Card
      </button>
      <div className="divider">
        <span>OR</span>
      </div>
      <button
        className="w-full ml-2 p-2 outline text-lg outline-primary-400 rounded-md text-white bg-[#181818] font-bold cursor-pointer"
        onClick={() => setPayWith("paypal")}
      >
        PayPal
      </button>
    </div>
  );
}

export default BuyNowPaymentChoice;
