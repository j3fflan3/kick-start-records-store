import ComingSoonSmall from "@/src/app/_components/ComingSoonSmall";

function Page() {
  return (
    <div>
      <ComingSoonSmall />
      <div className="flex grid-cols-3 mt-10">
        <div className="w-1/4"></div>
        <div className="text-4xl dark:text-primary-100 w-1/2">
          <p className=" tracking-wide font-normal text-4xl text-center mb-4">
            Welcome to Kick Start Records
          </p>
          <p className=" tracking-wide font-normal text-xl dark:text-primary-400 text-center mb-6">
            An independent Alternative/Rock/Metal Label and eCommerce store.
          </p>
          <p className="text-lg">
            Founded in February 2025, our mission is to help indie labels and
            bands with an online store where they not only can list and sell
            their records and merch, but they also get to choose whether they
            ship the goods themselves, or have us do the dirty work!
          </p>
        </div>
        <div className="w-1/4"></div>
      </div>
    </div>
  );
}

export default Page;
