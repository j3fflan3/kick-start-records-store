"use client";

import { formatDollars } from "@/src/app/_library/utilities";
import Image from "next/image";

function OrderItemCard({ item }) {
  return (
    <li key={item.catalogId} className="flex py-6 sm:py-10">
      <div className="shrink-0">
        <Image
          height="200"
          width="200"
          alt={item.title}
          src={item.image.url}
          className="size-24 rounded-md object-cover sm:size-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm dark:text-primary-100">
                {item.title} {item.recordFormat}
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              {/* <p className="text-gray-500">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {product.size}
                            </p>
                          ) : null} */}
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-primary-100">
              ${formatDollars(item.price)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="grid w-full max-w-16 grid-cols-1"></div>

            <div className="absolute top-0 right-0">x {item.count}</div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default OrderItemCard;
