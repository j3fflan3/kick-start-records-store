"use client";
import Image from "next/image";
import { formatDollars, printRecordFormat } from "@/src/app/_library/utilities";

function UserOrderItem({ product, index, trackingDisabled }) {
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
          {printRecordFormat(product.recordFormat)}{" "}
          {product.count > 1 && `(x${product.count})`} by {product.artist}
        </p>
        <p className="text-primary-800 text-sm ml-2 mt-1">
          {product.description}
        </p>
        <p className="text-primary-800 text-sm ml-2 mt-1">
          ${formatDollars(product.price * product.count)}
        </p>
      </div>
      <div className="ml-auto p-2">
        {index === 0 && (
          <button
            disabled={trackingDisabled}
            className={` text-white p-2 rounded-md ${trackingDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-accent-700 cursor-pointer"}`}
          >
            Track Package
          </button>
        )}
      </div>
    </div>
  );
}

export default UserOrderItem;
