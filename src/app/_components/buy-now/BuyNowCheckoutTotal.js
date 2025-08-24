"use client";

import Image from "next/image";
import { formatDollars } from "@/src/app/_library/utilities";

function BuyNowCheckoutTotal({ product, tax, total }) {
  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-primary-100 py-4 dark:text-accent-50 md:px-10 lg:border-l lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:px-4 lg:pt-4 lg:pb-24 lg:rounded-r-md"
    >
      <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>

        <dl>
          <dt className="text-sm font-medium dark:text-primary-900">
            Amount due
          </dt>
          <dd className="mt-1 text-3xl font-bold tracking-tight dark:text-primary-900">
            ${total}
          </dd>
        </dl>

        <ul
          role="list"
          className="divide-y divide-white/10 text-sm font-medium dark:text-primary-900"
        >
          <li key={product.title} className="flex items-start space-x-4 py-6">
            <Image
              width={product.image.width}
              height={product.image.height}
              alt={product.title}
              src={product.image.url}
              className="size-35 flex-none rounded-md object-cover"
            />
            <div className="flex-auto space-y-1">
              <h3>{product.title}</h3>
            </div>
            <p className="flex-none text-base font-medium ">
              ${formatDollars(product.price)}
            </p>
          </li>
        </ul>

        <dl className="space-y-6 border-t border-white/10 pt-6 text-sm font-medium dark:text-primary-900">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>${formatDollars(product.price)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt>Taxes</dt>
            <dd>${tax}</dd>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-6 dark:text-primary-900">
            <dt className="text-base">Total</dt>
            <dd className="text-base">${total}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default BuyNowCheckoutTotal;
