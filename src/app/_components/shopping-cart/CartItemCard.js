"use client";

import Image from "next/image";
import { formatDecimal } from "@/src/app/_library/utilities";
import {
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useCart } from "@/src/app/_contexts/CartProvider";
import { useTransition } from "react";

function ShoppingCartCard({ item }) {
  const { updateCart } = useCart();
  const [isPending, startTransition] = useTransition();
  async function handleUpdateCart(count) {
    startTransition(async () => {
      await updateCart(item.catalogId, count);
    });
  }

  async function handleSelectChange(e) {
    await handleUpdateCart(e.target.value);
  }

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
                {/* <a
                              href={product.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            > */}
                {item.title}
                {/* </a> */}
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
              ${formatDecimal(item.price / 100)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="grid w-full max-w-16 grid-cols-1">
              <select
                name={`quantity-${item.count}`}
                aria-label={`Quantity, ${item.title}`}
                defaultValue={item.count}
                onChange={handleSelectChange}
                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option value={num} key={num}>
                    {num}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>

            <div className="absolute top-0 right-0">
              <button
                type="button"
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                onClick={() => {
                  handleUpdateCart(0);
                }}
              >
                <span className="sr-only">Remove</span>
                <XMarkIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 flex space-x-2 text-sm text-gray-700 dark:text-primary-100">
          {/* {item?.inStock ? ( */}
          <CheckIcon
            aria-hidden="true"
            className="size-5 shrink-0 text-green-500 dark:text-primary-100"
          />
          {/* ) : (
                        <ClockIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-300"
                        />
                      )} */}

          <span>
            In Stock
            {/* {item?.inStock
                          ? "In stock"
                          : `Ships in ${
                              item?.leadTime ? item?.leadTime : "no time"
                            }`} */}
          </span>
        </p>
      </div>
    </li>
  );
}

export default ShoppingCartCard;
