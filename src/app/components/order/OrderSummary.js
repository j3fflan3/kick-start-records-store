"use client";
import { useSession } from "../../contexts/SessionProvider";
import { itemsCount, itemsTotal } from "../../library/utilities";

function OrderSummary({ order }) {
  const { session } = useSession();
  const isLoggedIn = session && session.user.is_anonymous === false;

  const numItems = itemsCount(order.items);
  const subTotal = itemsTotal(order.items);
  const total = itemsTotal(
    order.items,
    (order.shipping ?? 0) * 100,
    (order.handling ?? 0) * 100,
    (order.tax ?? 0) * 100
  );
  return (
    <>
      <h2
        id="summary-heading"
        className="text-lg font-medium text-gray-900 dark:text-primary-100"
      >
        Order summary
      </h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600 dark:text-primary-300">
            Subtotal &#40;{numItems} {numItems === 1 ? "item" : "items"}&#41;
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-primary-100">
            ${subTotal}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-primary-200 dark:border-primary-600 pt-4">
          <dt className="flex items-center text-sm text-gray-600 dark:text-primary-300">
            <span>Shipping</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-primary-100">
            ${order.shipping}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex text-sm text-gray-600 dark:text-primary-300">
            <span>Tax</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-primary-100">
            ${order.tax ?? 0.0}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900 dark:text-primary-200">
            Order total
          </dt>
          <dd className="text-base font-medium text-gray-900 dark:text-primary-100">
            ${total}
          </dd>
        </div>
      </dl>
      <div className="flex mt-6 w-full content-center">
        {/* <Link
          href={checkoutURL}
          className="w-full text-center rounded-md border border-transparent bg-accent-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:cursor-pointer hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
        >
          Checkout
        </Link> */}
      </div>
    </>
  );
}

export default OrderSummary;
