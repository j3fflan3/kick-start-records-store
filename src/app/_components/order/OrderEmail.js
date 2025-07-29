function OrderEmail({ order_id }) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 lg:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          className={`mt-4 text-2xl/9 font-bold tracking-tight dark:text-white`}
        >
          Please either sign in or enter the email associated with the order
        </h2>
      </div>
    </div>
  );
}

export default OrderEmail;
