async function Page({ params }) {
  const { order_id } = await params;
  return <div>Checkout/Order Placed {order_id}</div>;
}

export default Page;
