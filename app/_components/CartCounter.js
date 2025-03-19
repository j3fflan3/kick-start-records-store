import { Suspense } from "react";
import SpinnerMini from "./SpinnerMini";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

function CartCounter({ count }) {
  return (
    <span className="border-accent-500 border-2 rounded-lg px-3 py-1">
      <button className="cursor-pointer">
        {count === 1 ? (
          <TrashIcon className="size-3 text-accent-500" />
        ) : (
          <MinusIcon className="size-3 text-primary-100" />
        )}
      </button>
      &nbsp;&nbsp;
      <Suspense fallback={<SpinnerMini />}>{count}&nbsp;&nbsp;</Suspense>
      <button className="cursor-pointer">
        <PlusIcon className="size-3 text-primary-100" />
      </button>
    </span>
  );
}

export default CartCounter;
