"use client";
import CartItemCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";

function ShoppingCart({ cart, guestId, cartId }) {
  return (
    <div className="bg-white dark:bg-primary-950">
      <div className="mx-auto max-w-2xl px-4 pt-8 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary-900 dark:text-primary-200 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only dark:text-primary-100">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-primary-600 border-t border-b border-gray-200 dark:border-primary-600"
            >
              {cart.map((item, itemIdx) => (
                <CartItemCard key={itemIdx} item={item} />
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-8 rounded-lg bg-gray-50 dark:bg-primary-900/13 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <OrderSummary cart={cart} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
