"use client";
import UserOrder from "@/src/app/components/profile/UserOrder";
function Orders({ orders, viewDetails }) {
  console.log(`orders:\n\t${JSON.stringify(orders, null, 2)}`);
  return (
    <div>
      <h1 className="text-xl/6 lg:text-2xl/6">Your Orders</h1>
      {orders.length > 0 &&
        orders.map((item) => {
          return (
            <UserOrder
              item={item}
              key={item.orderNumber}
              viewDetails={viewDetails}
            />
          );
        })}
    </div>
  );
}

export default Orders;
