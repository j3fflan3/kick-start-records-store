import ComingSoonSmall from "@/src/app/components/utilities/ComingSoonSmall";

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
          <p className=" tracking-wide font-normal text-xl dark:text-primary-50 text-center mb-6">
            An independent Alternative/Rock/Metal Label and eCommerce store.
          </p>
          <p className="text-lg dark:text-primary-300">
            Our mission is to support indie labels and bands with a professional
            online store where they can sell their music and merchandise.{" "}
            <a
              href="mailto:sales@kickstartrecords.com"
              className="font-bold text-accent-500"
            >
              Contact us
            </a>{" "}
            for information about selling your music and merchandise with us.
          </p>
          <p className="text-[10px] mt-6 text-center text-gray-400">
            California Seller&apos;s Permit #245052512-00001
          </p>
        </div>
        <div className="xs:hidden sm:w-1/5"></div>
      </div>
    </div>
  );
}

export default Page;
