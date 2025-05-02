"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { formatDollars, printRecordFormat } from "@/src/app/_library/utilities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../_contexts/CartProvider";
import { createGlobalStyle } from "styled-components";

function AddToCartSlider() {
  const {
    cartItem,
    cartLink,
    openCart,
    setOpenCart,
    setCartItem,
    setCartLink,
  } = useCart();
  console.log(cartItem);
  const router = useRouter();
  function handleContinueShopping(e) {
    setOpenCart(false);
    setCartItem(null);
    router.push("/");
  }
  function handleNavigateCart() {
    const link = cartLink;
    setOpenCart(false);
    setCartItem(null);
    setCartLink(null);
    router.push(link);
  }
  function handleCloseCart(e) {
    setOpenCart(false);
    setCartItem(null);
  }
  return (
    <Dialog open={openCart} onClose={handleCloseCart} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-primary-900/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-primary-950 shadow-xl">
                <div className="flex-.75 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-bold text-gray-900 dark:text-primary-100">
                      Added to your cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleCloseCart}
                        className="relative -m-2 p-2 text-gray-400 dark:text-primary-200 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <div className="-my-6 divide-y divide-gray-200 dark:divide-primary-700">
                        <div className="flex py-6">
                          <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-primary-900">
                            {cartItem && cartItem?.image && (
                              <Image
                                alt={cartItem.title}
                                src={cartItem.image.url}
                                width="96"
                                height="96"
                                className="size-full object-cover"
                              />
                            )}
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-primary-200">
                                <h3>
                                  {cartItem &&
                                    cartItem?.title &&
                                    cartItem.title}
                                </h3>
                                <p className="ml-4">
                                  $
                                  {cartItem &&
                                    cartItem?.price &&
                                    formatDollars(cartItem.price)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-primary-300">
                                {cartItem &&
                                  cartItem?.recordFormat &&
                                  printRecordFormat(cartItem.recordFormat)}{" "}
                                {cartItem &&
                                  cartItem?.artist &&
                                  ` by ${cartItem.artist}`}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500 dark:text-primary-300">
                                Qty{" "}
                                {cartItem && cartItem?.count && cartItem.count}
                              </p>

                              <div className="flex"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-primary-700 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-primary-100">
                    <p>Subtotal</p>
                    <p>
                      $
                      {cartItem &&
                        cartItem?.price &&
                        cartItem?.count &&
                        formatDollars(cartItem.price * cartItem.count)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-primary-300">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleNavigateCart}
                      className="flex items-center justify-center w-full rounded-md border border-transparent bg-accent-600 px-6 py-3 text-lg font-bold text-white shadow-xs hover:bg-accent-700 hover:cursor-pointer"
                    >
                      View Cart
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-primary-300">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={handleContinueShopping}
                        className="font-medium text-accent-600 hover:text-accent-500 hover:cursor-pointer dark:text-accent-500 dark:hover:text-accent-400"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AddToCartSlider;
