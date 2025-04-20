"use client";
import Image from "next/image";
import { printRecordFormat } from "@/src/app/_library/utilities";

function AddToCartToast({ item, cssClasses, handleCartClick, handleClose }) {
  console.log("AddToCartToast");
  return (
    <div className={cssClasses}>
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="pt-0.5">
            <Image
              width="100"
              height="100"
              className="rounded-xs"
              src={item.image.url}
              alt={item.title}
              priority
            />
          </div>
          <div className="ml-3 flex-1">
            <p>
              <span className="text-lg  text-primary-100">
                &apos;{item.title}&apos;
              </span>
            </p>
            <p className="mt-1 text-xs text-primary-300">
              {printRecordFormat(item.recordFormat)}
              {/* by {item.artist}  */}
              &nbsp;was added to your cart
            </p>
            <p className="mt-4">
              <button
                onClick={handleCartClick}
                className="bg-accent-700 px-3 py-[5px] mr-2  text-primary-50 text-base rounded-md"
              >
                View Cart &rarr;
              </button>
              <button
                onClick={handleClose}
                className="px-3 py-1 border-primary-500 border text-primary-50 text-base rounded-md"
              >
                Close
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCartToast;
