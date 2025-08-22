import OrderItemCard from "./OrderItemCard";
import OrderSummary from "./OrderSummary";

function OrderDetail({ order }) {
  const { shippingAddress } = order;
  const shipToName =
    shippingAddress?.name?.full_name ??
    shippingAddress?.email_address ??
    "Guest";

  const trackingNumber = order.tracking_number;
  // const trackingNumber = "123456798";
  const {
    address_line_1,
    address_line_2,
    admin_area_2,
    admin_area_1,
    postal_code,
    country_code,
  } = order.shippingAddress.address;
  console.log(`OrderDetail -> order:\n\t${JSON.stringify(order, null, "\t")}`);
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-3xl">
          Thank you for your order!
        </h1>
        {!trackingNumber && (
          <h2 className="text-lg mt-2 font-bold tracking-tight text-primary-900 dark:text-primary-400 sm:text-xl">
            We&apos;ll notify you as soon as it ships.
          </h2>
        )}
        <h3 className="mt-6 text-lg font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-xl">
          Order #{order.order_number}
        </h3>
        <p className="mt-1">
          {new Date(order.orderedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <div className="mt-6">
          <p className="font-bold">Ship To</p>
          <p className="mt-2">{shipToName}</p>
          <p>{address_line_1}</p>
          <p>{address_line_2}</p>
          <p>
            {admin_area_2}, {admin_area_1}
          </p>
          <p>{postal_code}</p>
          <p>{country_code}</p>
        </div>

        <p className="mt-4">
          Tracking Number: {trackingNumber ?? "[Not yet shipped]"}
        </p>
        <p className="mt-4">
          Payment Status:{" "}
          {order.paypal_payment_status ?? "[Awaiting confirmation]"}
        </p>
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

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-8 rounded-lg bg-gray-50 dark:bg-primary-900/13 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <OrderSummary order={order} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
