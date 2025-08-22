"use client";

import UserOrderItem from "@/src/app/_components/profile/UserOrderItem";
import { calculateTotal, formatShortDate } from "@/src/app/_library/utilities";

function UserOrder({ item, viewDetails }) {
  const { shippingAddress, created: orderDate, trackingNumber } = item;
  const { full_name: fullName } = shippingAddress.name;
  // convert decimals to cents, aggregate the total, then back to decimal
  const total = calculateTotal(
    item.subtotal * 100,
    item.shipping * 100,
    item.handling * 100,
    item.tax * 100
  );

  return (
    <div className="mt-4">
      <div className="flex grid-cols-4 text-lg text-primary-700 w-full shipping-header p-2 rounded-t-md mt-2">
        <div className="grid-row mr-8">
          <ul>
            <li className="text-sm">ORDER PLACED</li>
            <li>{formatShortDate(orderDate)}</li>
          </ul>
        </div>
        <div className="grid-row mr-8">
          <ul>
            <li className="text-sm">TOTAL</li>
            <li>${total}</li>
          </ul>
        </div>
        <div className="grid-row mr-8">
          <ul>
            <li className="text-sm">SHIP TO</li>
            <li>{fullName}</li>
          </ul>
        </div>
        <div className="ml-auto">
          <ul>
            <li className="text-sm">Order # {item.orderNumber} </li>
            <li>
              <button
                className="outline-1 py-1 px-2 cursor-pointer rounded-md outline-primary-500 active:bg-primary-200 hover:bg-primary-300"
                onClick={() => viewDetails(item)}
              >
                View Order Details
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white p-2 !rounded-b-md">
        {item.items.length > 0 &&
          item.items.map((product, index) => {
            return (
              <UserOrderItem
                product={product}
                key={index}
                index={index}
                trackingNumber={trackingNumber}
              />
            );
          })}
      </div>
    </div>
  );
}

export default UserOrder;
