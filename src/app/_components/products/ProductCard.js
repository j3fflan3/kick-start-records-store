import Image from "next/image";
import AddToCart from "../cart/AddToCart";
import Link from "next/link";
import { printRecordFormat } from "../../_library/utilities";

function ProductCard({ product }) {
  const { image, title, price, catalogId, recordFormat } = product;
  const usd = Number(parseFloat(price / 100));
  return (
    <div className="flex-1 w-full group content-center">
      <Link href={`/records/${catalogId}`} key={catalogId}>
        <Image
          width="222"
          height="222"
          alt={title}
          src={image.url}
          className="aspect-square rounded-lg bg-gray-200 group-hover:opacity-75"
        />
        <h3 className="mt-4 text-sm dark:text-gray-200">
          {title} - {printRecordFormat(recordFormat)}
        </h3>
        <div className="mt-1 text-lg w-full font-medium dark:text-gray-300">
          ${usd}&nbsp;
        </div>
      </Link>
      <div className="mt-2 items-center">
        <AddToCart
          catalogId={catalogId}
          className="border border-primary-700 py-1 px-2 w-7/8 items-center rounded-md text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
        />
      </div>
    </div>
  );
}

export default ProductCard;
