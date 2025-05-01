import Image from "next/image";
import Link from "next/link";
import AddToCart from "@/src/app/_components/shopping-cart/AddToCart";
import { printRecordFormat } from "@/src/app/_library/utilities";

function RecordCard({ record }) {
  const { artist, catalogId, title, image, description, price, recordFormat } =
    record;
  const usd = Number(parseFloat(price / 100));

  return (
    <div className="flex border-primary-800 border rounded-md">
      <div className="relative aspect-square justify-evenly">
        <Image
          src={image.url}
          alt={title}
          width="222"
          height="222"
          className="flex-1 border-r rounded-xs border-primary-800 object-contain"
        />
      </div>
      <div className="grow">
        <div className="pt-2 pb-4 px-7 bg-primary-950">
          <h3 className="text-primary-300 font-semibold text-xl mb-3">
            &quot;{title}&quot;
          </h3>
          <h4 className="text-primary-400 mb-3">Artist: {artist}</h4>

          <div className="flex gap-3 items-center mb-2">
            <p className="text-primary-400">{description}</p>
          </div>

          <p className="flex gap-3 items-baseline">
            {printRecordFormat(recordFormat)}&nbsp;<b>${usd}</b>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 pl-4 text-left">
          <AddToCart catalogId={catalogId} />
          <Link
            href={`/records/${catalogId}`}
            className="border border-primary-700 rounded-md py-2 px-4 inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCard;
