"use client";

import TrackList from "@/src/app/components/records/TrackList";
import AddToCart from "@/src/app/components/shopping-cart/AddToCart";
import AddToCartSlider from "@/src/app/components/shopping-cart/AddToCartSlider";
import { formatDollars } from "@/src/app/library/utilities";
import { CheckIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

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

  return (
    <>
      <AddToCartSlider />
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
                  ${formatDollars(price)}
                </p>

                <div className="ml-4 border-l border-gray-300 pl-4">
                  <h2 className="sr-only">Format</h2>
                  <div className="flex items-center">
                    <div>
                      {recordFormat} by {artist}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-6">
                <p className="text-base text-primary-950 dark:text-primary-300">
                  {description}
                </p>
              </div>

              {recordFormat !== "Download" && (
                <div className="mt-2 flex items-center">
                  <CheckIcon
                    aria-hidden="true"
                    className="size-5 shrink-0 text-green-700 font-bold"
                  />
                  <p className="ml-2 text-sm text-green-700">
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
              src={image.url}
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
                  {recordFormat === "DigitalDownload" ||
                  recordFormat === "Digital Download" ? (
                    <button
                      disabled
                      className="disabled:text-primary-600 border border-primary-700 py-1 px-2 w-full items-center rounded-md text-lg inline-block  hover:bg-accent-600 disabled:hover:bg-primary-950 transition-all hover:text-primary-50 disabled:hover:cursor-default hover:cursor-pointer"
                    >
                      Buy Now
                    </button>
                  ) : (
                    <AddToCart
                      catalogId={catalogId}
                      className="border border-primary-700 py-1 px-2 w-full items-center rounded-md text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
                    />
                  )}
                </div>
                <div className="mt-6 text-center"></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
