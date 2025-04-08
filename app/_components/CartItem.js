import Image from "next/image";
import { formatDecimal, printRecordFormat } from "@/app/_library/utilities";
import CartCounter from "./CartCounter";
import { Suspense } from "react";
import SpinnerMini from "./SpinnerMini";

function CartItem({ item }) {
  const {
    catalogId,
    artist,
    title,
    description,
    count,
    price,
    image,
    recordFormat,
  } = item;
  return (
    <div key={catalogId} className="w-full">
      <div className="flex bg-primary-800 p-2 border-b border-primary-700">
        <div className="relative aspect-square m-1">
          <Image
            src={image.url}
            width="180"
            height="180"
            alt={title}
            className="flex-none border-r border-primary-800 rounded-sm cart-image"
          />
        </div>
        <div className="grid grid-flow-row ml-2 w-full">
          <div className="flex flex-row">
            <div className="text-primary-300 text-2xl font-bold w-100">
              {title}
            </div>
            <div className="flex w-60 grow align-bottom justify-end mr-4">
              ${formatDecimal(price / 100)}
            </div>
          </div>
          <div className="text-primary-400 text-lg font-bold">by {artist}</div>
          <div className="text-primary-500 text-base font-bold mb-4">
            {printRecordFormat(recordFormat)}
          </div>
          <div className="flex flex-row">
            <div className="w-30 flex-none">
              <CartCounter catalogId={catalogId} count={count} />
            </div>
            <div className="w-40 pl-2 grow justify-start">
              <span className="text-primary-500">Item Subtotal:</span> $
              {formatDecimal((count * price) / 100)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
