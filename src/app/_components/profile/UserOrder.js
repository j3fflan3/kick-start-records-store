"use client";

import { calculateTotal, formatShortDate } from "@/src/app/_library/utilities";

function UserOrder({ item, user }) {
  const { shippingAddress, created: orderDate } = item;
  const { full_name: fullName } = shippingAddress.name;
  const total = calculateTotal(
    item.subtotal * 100,
    item.shipping * 100,
    item.handling * 100,
    item.tax * 100
  );
  return (
    <div className="flex grid-cols-4 text-lg text-accent-50 w-full bg-primary-500 p-2 rounded-t-md mt-2">
      <div className="grid-row mr-4">
        <ul>
          <li>Order Placed</li>
          <li>{formatShortDate(orderDate)}</li>
        </ul>
      </div>
      <div className="grid-row mr-4">
        <ul>
          <li>Total</li>
          <li>${total}</li>
        </ul>
      </div>
      <div className="grid-row mr-4">
        <ul>
          <li>Ship To</li>
          <li>{fullName}</li>
        </ul>
      </div>
      <div className="grid-row justify-items-end">
        <ul>
          <li>Order # {item.orderNumber} </li>
          <li>View Order Details</li>
        </ul>
      </div>
    </div>
  );
}

export default UserOrder;
