import Spinner from "@/src/app/components/spinners/Spinner";
import { Suspense } from "react";
import OrderDetail from "@/src/app/components/order/OrderDetail";
import OrderError from "@/src/app/components/order/OrderError";
import { getOrderDetail } from "@/src/app/library/server/paypal";

async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { order_id, email: base64Email } = await params;

  const email = Buffer.from(
    decodeURIComponent(base64Email),
    "base64"
  ).toString();

  const { data: order, error } = await getOrderDetail(order_id, email);
  console.log(`order:\t${JSON.stringify(order, null, 2)}`);
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
