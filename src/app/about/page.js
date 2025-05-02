import ComingSoonSmall from "@/src/app/_components/utilities/ComingSoonSmall";

function Page() {
  return (
    <div>
      <ComingSoonSmall />
      <div className="flex grid-cols-3 mt-10">
        <div className="xs:hidden sm:w-1/5"></div>
        <div className="text-4xl dark:text-primary-100 w-full sm:w-3/5">
          <p className=" tracking-wide font-normal text-4xl text-center mb-4">
            Welcome to Kick Start Records
          </p>
          <p className=" tracking-wide font-normal text-xl dark:text-primary-400 text-center mb-6">
            An independent Alternative/Rock/Metal Label and eCommerce store.
          </p>
          <p className="text-lg">
            Our mission is to support indie labels and bands with a professional
            online store where they can sell their music and merchandise.
          </p>
        </div>
        <div className="xs:hidden sm:w-1/5"></div>
      </div>
    </div>
  );
}

export default Page;
