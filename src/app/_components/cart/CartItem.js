import CartCounter from "@/src/app/_components/cart/CartCounter";
import { formatDecimal, printRecordFormat } from "@/src/app/_library/utilities";
import Image from "next/image";
// Item's description plus medium desc and availability
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
      <div className="flex dark:bg-primary-950 p-2 border-b dark:border-primary-800">
        <div className="relative aspect-square m-1">
          <Image
            src={image.url}
            width="180"
            height="180"
            alt={title}
            className="flex-none border-r dark:border-primary-800 rounded-xs cart-image"
          />
        </div>
        <div className="grid grid-flow-row ml-2 w-full">
          <div className="flex flex-row">
            <div className="dark:text-primary-300 text-2xl font-bold w-100">
              {title}
            </div>
            <div className="flex w-60 grow align-bottom justify-end mr-4">
              ${formatDecimal(price / 100)}
            </div>
          </div>
          <div className="dark:text-primary-400 text-lg font-bold">
            by {artist}
          </div>
          <div className="dark:text-primary-500 text-base font-bold mb-4">
            {printRecordFormat(recordFormat)}
          </div>
          <div className="flex flex-row">
            <div className="flex-none">
              <CartCounter catalogId={catalogId} count={count} />
            </div>
            <div className="w-40 pl-2 grow justify-start">
              <span className="dark:text-primary-500">Item Subtotal:</span> $
              {formatDecimal((count * price) / 100)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
