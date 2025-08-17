import Spinner from "@/src/app/_components/spinners/Spinner";
import { Suspense } from "react";
import OrderDetail from "@/src/app/_components/order/OrderDetail";
import OrderError from "@/src/app/_components/order/OrderError";
import { getOrderDetail } from "@/src/app/_library/server/paypal";

async function Page({ params }) {
  const { order_id, email: base64Email } = await params;

  const email = Buffer.from(
    decodeURIComponent(base64Email),
    "base64"
  ).toString();

  const { data: order, error } = await getOrderDetail(order_id, email);
  if (order?.error || error) {
    console.log(`Error retrieving order: ${error?.message || order?.error} `);
    return <OrderError order_id={order_id} />;
  }
  return (
    <Suspense fallback={<Spinner />}>
      <OrderDetail order={order} />
    </Suspense>
  );
}

export default Page;
