import Image from "next/image";
import TrackList from "@/src/app/_components/records/TrackList";
import AddToCart from "@/src/app/_components/cart/AddToCart";
import Link from "next/link";

function Record({ record }) {
  const { artist, catalogId, title, image, description, price, attributes } =
    record;
  console.log(JSON.stringify(record));
  return (
    <div className="relative flex grid-cols-4 gap-1">
      <div className="w-1/4 col-span-1"></div>
      <div className="relative col-span-1 w-1/4">
        <Image
          width="240"
          height="240"
          src={image.url}
          alt={`${title}`}
          className="rounded-md"
        />
      </div>
      <div className="relative col-span-1 w-1/2">
        <h5 className="text-2xl">{title}</h5>
        <h6 className="text-xl mb-4">By {artist}</h6>
        {/* <p>{description}</p> */}
        <AddToCart
          catalogId={catalogId}
          className="mr-4 px-2 py-2 w-[108.5px] h-[40px] inline-block border border-primary-700 rounded-md hover:cursor-pointer hover:bg-accent-600 hover:text-primary-50"
        />
        <Link
          href={`/records`}
          className="border border-primary-700 rounded-md py-2 px-2  inline-block hover:bg-accent-700 transition-all hover:text-primary-50"
        >
          Continue Shopping &rarr;
        </Link>
        <TrackList tracks={attributes.tracks} />
      </div>
      {/* <div className="w-1/4 col-span-1"></div> */}
    </div>
  );
}

export default Record;
