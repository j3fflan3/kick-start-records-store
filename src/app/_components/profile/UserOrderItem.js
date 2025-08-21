"use client";
import Image from "next/image";
import { printRecordFormat } from "@/src/app/_library/utilities";

function UserOrderItem({ product }) {
  return (
    <div className="flex flex-1 columns-3">
      <div className="shrink-0 my-2 ml-1.5" key={product.title}>
        <Image
          height="200"
          width="200"
          alt={product.title}
          src={product.image.url}
          className="size-24 rounded-md object-cover sm:size-48"
        />
      </div>
      <div className="p-2">
        <p className="text-primary-900 font-bold ml-2">{product.title}</p>
        <p className="text-primary-800 text-sm ml-2">
          {printRecordFormat(product.recordFormat)} by {product.artist}
        </p>
        <p className="text-primary-800 text-sm ml-2 mt-1">
          {product.description}
        </p>
      </div>
      <div className="ml-auto p-2">
        <button className="bg-accent-700 text-white p-2 rounded-md">
          Track Package
        </button>
      </div>
    </div>
  );
}

export default UserOrderItem;
