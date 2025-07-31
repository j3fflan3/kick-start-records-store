import Spinner from "@/src/app/_components/spinners/Spinner";
import { Suspense } from "react";
import OrderDetail from "@/src/app/_components/order/OrderDetail";
import OrderEmail from "@/src/app/_components/order/OrderEmail";
import { serverGetOrderDetail } from "@/src/app/_library/serverActions";

async function Page({ params }) {
  const { order_id } = await params;
  const { data: order, error } = await serverGetOrderDetail(order_id);
  console.log(`order:\n\t${JSON.stringify(order)}`);
  if (order?.error && order.is_anonymous) {
    return <OrderEmail order_id={order_id} />;
  }
  return (
    <Suspense fallback={<Spinner />}>
      <OrderDetail order={order} />
    </Suspense>
  );
}

export default Page;
