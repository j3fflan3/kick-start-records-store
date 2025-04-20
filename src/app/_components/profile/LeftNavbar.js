function LeftNavbar() {
  return (
    <div className="row-span-3 justify-stretch grid place-content-center rounded-md bg-primary-800 p-4">
      <div className="w-full p-2 content-start bg-primary-700">
        <h1 className="w-full p-2 text-2xl">Orders</h1>
        <p> </p>
      </div>
      <div className="w-full ps-2 content-start bg-primary-700">
        <h1 className="w-full p-2 text-2xl">Account</h1>
        <p> </p>
      </div>
    </div>
  );
}

export default LeftNavbar;
