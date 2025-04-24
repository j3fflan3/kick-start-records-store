"use client";

import Link from "next/link";

function CartIsEmpty() {
  return (
    <div className="relative z-10 text-center">
      <div className="text-2xl dark:text-primary-100 mb-10 tracking-tight font-normal">
        Your cart is empty.{" "}
        <Link
          href="/records"
          className="border border-primary-700 ml-2 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
        >
          Continue shopping &rarr;
        </Link>
      </div>
    </div>
  );
}

export default CartIsEmpty;
