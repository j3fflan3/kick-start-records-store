"use client";

import OrderItemCard from "@/src/app/components/order/OrderItemCard";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import OrderSummary from "@/src/app/components/order/OrderSummary";

function UserOrderDetails({ order, back }) {
  const {
    address_line_1: address,
    address_line_2: addressContinued,
    admin_area_2: city,
    admin_area_1: stateProvince,
    postal_code: postalCode,
    country_code: countryCode,
  } = order.shippingAddress.address;
  const { full_name: fullName } = order.shippingAddress.name;
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex grid-cols-2 ">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-3xl">
              Order #{order.orderNumber}
            </h3>
          </div>
          <div className="ml-auto align-baseline ">
            <button
              onClick={back}
              className="font-medium text-lg outline outline-primary-700 py-2 px-3 rounded-md cursor-pointer"
            >
              Back&nbsp;
              <ArrowLeftStartOnRectangleIcon className="text-white size-8 inline-block" />
            </button>
          </div>
        </div>
        <div>
          {!order.trackingNumber && (
            <h2 className="text-lg mt-2 font-bold tracking-tight text-primary-900 dark:text-primary-400 sm:text-xl">
              We&apos;ll notify you as soon as it ships.
            </h2>
          )}

          <p className="mt-1">
            {new Date(order.created).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
          <div className="mt-6">
            <p className="font-bold">Ship To</p>
            <p className="mt-2">{fullName}</p>
            <p>{address}</p>
            <p>{addressContinued && addressContinued}</p>
            <p>
              {city}, {stateProvince}
            </p>
            <p>{postalCode}</p>
            <p>{countryCode}</p>
          </div>

          <p className="mt-4">
            Tracking Number: {order.trackingNumber ?? "[Not yet shipped]"}
          </p>
          <div className="mt-4">
            Payment Method:
            {order.paymentSource?.paypal && <p>PayPal</p>}
            {order.paymentSource?.card && (
              <p>
                {order.paymentSource.card.brand} ending in{" "}
                {order.paymentSource.card.last_digits}
              </p>
            )}
          </div>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only dark:text-primary-100">
                Order Items
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-primary-600 border-t border-b border-gray-200 dark:border-primary-600"
              >
                {order.items.map((item, itemIdx) => (
                  <OrderItemCard key={itemIdx} item={item} />
                ))}
              </ul>
            </section>
            <section
              aria-labelledby="summary-heading"
              className="mt-8 rounded-lg bg-gray-50 dark:bg-primary-900/13 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <OrderSummary order={order} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserOrderDetails;
