"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { formatDecimal, printRecordFormat } from "../../_library/utilities";
import TrackList from "../records/TrackList";
import SubmitButton from "../buttons/SubmitButton";
import AddToCart from "../cart/AddToCart";

export default function Product({ record }) {
  const {
    artist,
    catalogId,
    title,
    image,
    description,
    price,
    attributes,
    recordFormat,
  } = record;
  const format = printRecordFormat(recordFormat);
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-4 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-primary-900 dark:text-primary-100 sm:text-4xl">
              {title}
            </h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="flex items-center">
              <p className="text-lg text-gray-900 dark:text-primary-100 sm:text-xl">
                ${formatDecimal(price / 100)}
              </p>

              <div className="ml-4 border-l border-gray-300 pl-4">
                <h2 className="sr-only">Format</h2>
                <div className="flex items-center">
                  <div>
                    {format} by {artist}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 space-y-6">
              <p className="text-base text-primary-500">{description}</p>
            </div>

            {format !== "Download" && (
              <div className="mt-2 flex items-center">
                <CheckIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-primary-900 dark:text-white"
                />
                <p className="ml-2 text-sm text-primary-500">
                  In stock and ready to ship
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Product image */}
        <div className="mt-1 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-start">
          <Image
            width="400"
            height="400"
            alt={record.title}
            src={record.image.url}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </div>

        {/* Product form */}
        <div className="mt-2 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <h2 id="options-heading" className="sr-only">
              Track List
            </h2>

            <div>
              <div className="sm:flex sm:justify-between">
                <TrackList tracks={attributes.tracks} />
              </div>
              <div className="mt-4"></div>
              <div className="mt-5">
                <AddToCart
                  catalogId={catalogId}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-accent-600 px-8 py-3 text-base font-medium text-white hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                >
                  Add to Cart
                </AddToCart>
              </div>
              <div className="mt-6 text-center"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
