"use client";
import { formatDollars } from "@/src/app/_library/utilities";
import Image from "next/image";

function UserOrderItem({ product, index, trackingNumber }) {
  return (
    <div className="flex grid-cols-3 justify-items-normal">
      <div className="shrink-0 my-2 ml-1.5" key={product.title}>
        <Image
          height="200"
          width="200"
          alt={product.title}
          src={product.image.url}
          className="size-24 rounded-md object-cover sm:size-48"
        />
      </div>
      <div className="p-2 w-1/2">
        <p className="text-primary-900 font-bold ml-2">{product.title}</p>
        <p className="text-primary-800 text-sm ml-2">
          {product.recordFormat} {product.count > 1 && `(x${product.count})`} by{" "}
          {product.artist}
        </p>
        <p className="text-primary-800 text-sm ml-2 mt-1">
          {product.description}
        </p>
        <p className="text-primary-800 text-sm ml-2 mt-1">
          ${formatDollars(product.price * product.count)}
        </p>
      </div>
      <div className="ml-auto p-2 dark:text-primary-900">
        {/* turn it off for now */}
        {trackingNumber && (
          <a
            target="_blank"
            href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`}
          >
            Tracking # {trackingNumber}
          </a>
        )}
      </div>
    </div>
  );
}

export default UserOrderItem;
