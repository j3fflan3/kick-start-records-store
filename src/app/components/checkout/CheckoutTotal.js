import Image from "next/image";
import { itemsTotal, formatDollars } from "../../library/utilities";

function CheckoutTotal({ cart, tax, total, shippingCost }) {
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
          {cart.map((item) => (
            <li key={item.title} className="flex items-start space-x-4 py-6">
              <Image
                width={item.image.width}
                height={item.image.height}
                alt={item.title}
                src={item.image.url}
                className="size-35 flex-none rounded-md object-cover"
              />
              <div className="flex-auto space-y-1">
                <h3>
                  {item.title} (x{item.count})
                </h3>
              </div>
              <p className="flex-none text-base font-medium ">
                ${formatDollars(item.price * item.count)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-6 border-t border-white/10 pt-6 text-sm font-medium dark:text-primary-900">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd>${itemsTotal(cart)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt>Shipping</dt>
            <dd>${shippingCost}</dd>
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

export default CheckoutTotal;
