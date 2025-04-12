"use client";
import Image from "next/image";
import { printRecordFormat } from "@/src/app/_library/utilities";

function AddToCartToast({ item, cssClasses, handleCartClick }) {
  console.log(cssClasses);
  return (
    <div className={cssClasses}>
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="pt-0.5">
            <Image
              width="100"
              height="100"
              className="rounded-sm"
              src={item.image.url}
              alt={item.title}
              priority
            />
          </div>
          <div className="ml-3 flex-1">
            <p>
              <span className="text-xl  text-primary-100">
                &apos;{item.title}&apos;
              </span>
              &nbsp;was added to your cart!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {printRecordFormat(item.recordFormat)} by {item.artist}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={handleCartClick}
          className="bg-accent-700 mb-3 mt-3 mr-4 ml-4 px-3 py-1 border-primary-500 rounded-md"
        >
          View Cart
        </button>
      </div>
    </div>
  );
}

export default AddToCartToast;
