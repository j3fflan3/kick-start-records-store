import ComingSoonSmall from "@/src/app/_components/utilities/ComingSoonSmall";

function Page() {
  return (
    <>
      <ComingSoonSmall />
      <div className="flex grid-cols-3">
        <div className="w-1/3"></div>
        <div className="w-1/3 text-center text-5xl mt-10">Merchandise</div>
        <div className="w-1/3"></div>
      </div>
    </>
  );
}

export default Page;
