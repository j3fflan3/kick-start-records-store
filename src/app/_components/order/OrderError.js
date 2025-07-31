function OrderError({ order_id }) {
  async function onSubmit(email) {
    await serverGetOrderDetail(order_id, email);
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 lg:px-6">
      <div className="mx-auto w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h2
          className={`mt-4 text-2xl/9 font-bold tracking-tight dark:text-white`}
        >
          There was an error retrieving your order. Please try again or contact
          support@kickstartrecords.com. Reference Order ID: {order_id}
        </h2>
      </div>
    </div>
  );
}

export default OrderError;
