import Image from "next/image";
import Link from "next/link";
import AddToCart from "./AddToCart";
import { printRecordFormat } from "../_library/utilities";

function RecordCard({ record }) {
  const { artist, catalogId, title, image, description, price, recordFormat } =
    record;
  const usd = Number(parseFloat(price / 100));

  return (
    <div className="flex border-primary-800 border rounded-sm">
      <div className="flex-auto relative aspect-square">
        <Image
          src={image.url}
          alt={title}
          fill
          className="flex-1 border-r border-primary-800 object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="pt-2 pb-4 px-7 bg-primary-950">
          <h3 className="text-primary-300 font-semibold text-xl mb-3">
            &quot;{title}&quot;
          </h3>
          <h4 className="text-primary-400 mb-3">Artist: {artist}</h4>

          <div className="flex gap-3 items-center mb-2">
            {/* <UsersIcon className="h-5 w-5 text-primary-600" /> */}
            {/* <p className="text-lg text-primary-200">
              For up to <span className="font-bold">{maxCapacity}</span> guests
            </p> */}
            <p className="text-primary-400">{description}</p>
          </div>

          <p className="flex gap-3 items-baseline">
            {/* {discount > 0 ? (
              <>
                <span className="text-3xl font-[350]">
                  ${regularPrice - discount}
                </span>
                <span className="line-through font-semibold text-primary-600">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-[350]">${regularPrice}</span>
            )}
            <span className="text-primary-200">/ night</span> */}
            {printRecordFormat(recordFormat)}&nbsp;<b>${usd}</b>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          <AddToCart catalogId={catalogId} disabled={false} />
          <Link
            href={`/records/${catalogId}`}
            className="border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCard;
