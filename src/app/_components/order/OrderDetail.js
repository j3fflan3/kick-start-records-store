import OrderItemCard from "./OrderItemCard";
import OrderSummary from "./OrderSummary";

const order = [
  {
    order_id: "f704b501-d95f-4fd5-979e-e404c2544308",
    order_number: "KSR-0000000063",
    tracking_number: null,
    paypal_payment_status: "COMPLETED",
    subtotal: 21.98,
    shipping: 4.82,
    handling: 0.0,
    tax: 0.0,
    title: "The Voyage of Jonas",
    artist: "Heart of Cygnus",
    description: "Fourth album from Heart of Cygnus",
    image: {
      uom: "px",
      url: "https://vnshanftypzvajpbbwxr.supabase.co/storage/v1/object/public/images/VOJ.jpg",
      width: 1500,
      height: 1500,
    },
    catalogId: "ef08fd93-a851-444f-a94b-baedc45f6e2c",
    recordFormat: "CD",
    count: 1,
    price: 1099,
    weight: 0.125,
    sku: null,
    upc: "713757776028",
  },
  {
    order_id: "f704b501-d95f-4fd5-979e-e404c2544308",
    order_number: "KSR-0000000063",
    tracking_number: null,
    paypal_payment_status: "COMPLETED",
    subtotal: 21.98,
    shipping: 4.82,
    handling: 0.0,
    tax: 0.0,
    title: "Utopia",
    artist: "Heart of Cygnus",
    description: "Freshman debut of Heart of Cygnus",
    image: {
      uom: "px",
      url: "https://vnshanftypzvajpbbwxr.supabase.co/storage/v1/object/public/images/Utopia.jpg",
      width: 500,
      height: 500,
    },
    catalogId: "74980f9c-ba01-4788-b0ac-84740491ffe3",
    recordFormat: "CD",
    count: 1,
    price: 1099,
    weight: 0.207,
    sku: null,
    upc: "837101354257",
  },
];

function OrderDetail() {
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-4xl">
          Order #{order[0].order_number}
        </h1>
        <p className="mt-6">
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
