import OrderItemCard from "./OrderItemCard";
import OrderSummary from "./OrderSummary";

function OrderDetail({ order }) {
  const { shippingAddress } = order[0];
  const shipToName =
    shippingAddress?.name?.full_name ??
    shippingAddress?.email_address ??
    "Guest";
  console.log(`OrderDetail -> order:\n\t${JSON.stringify(order)}`);
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-4xl">
          Order #{order[0].order_number}
        </h1>
        <div className="mt-6">
          <p className="font-bold">Ship To</p>
          <p className="mt-2">{shipToName}</p>
          <p>{order[0].shippingAddress.address.address_line_1}</p>
          <p>{order[0].shippingAddress.address.address_line_2}</p>
          <p>
            {order[0].shippingAddress.address.admin_area_2},{" "}
            {order[0].shippingAddress.address.admin_area_1}
          </p>
          <p>{order[0].shippingAddress.address.postal_code}</p>
          <p>{order[0].shippingAddress.address.country_code}</p>
        </div>
        <p className="mt-6">
          Order Date:{" "}
          {new Date(order[0].orderedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <p className="mt-4">
          Tracking Number: {order[0].tracking_number ?? "[Not yet shipped]"}
        </p>
        <p className="mt-4">
          Payment Status:{" "}
          {order[0].paypal_payment_status ?? "[Awaiting confirmation]"}
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
              {order.map((item, itemIdx) => (
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
