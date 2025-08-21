"use client";
import UserOrder from "@/src/app/_components/profile/UserOrder";
function Orders({ user, orders }) {
  console.log(`orders:\n\t${JSON.stringify(orders, null, "\t")}`);
  return (
    <div>
      <h1 className="text-xl/6 lg:text-2xl/6">Your Orders</h1>
      {orders.length > 0 &&
        orders.map((item) => {
          return <UserOrder item={item} user={user} key={item.orderNumber} />;
        })}
    </div>
  );
}

export default Orders;
