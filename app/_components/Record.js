import Image from "next/image";
import TrackList from "./TrackList";

function Record({ record }) {
  const { artist, catalogId, title, image, description, price, attributes } =
    record;
  return (
    <div className="grid grid-cols-2 gap-4 border border-primary-800 py-3 px-10 mb-24">
      <div className="relative col-span-1 -translate-x-2 aspect-square">
        <Image
          fill
          src={image.url}
          alt={`${title}`}
          className="object-cover m-4"
          sizes=""
        />
      </div>
      <div className="relative col-span-1 aspect-square">
        <h5>{title}</h5>
        <h6>By {artist}</h6>
        <p>{description}</p>
        <TrackList tracks={attributes.tracks} />
      </div>
    </div>
  );
}

export default Record;
