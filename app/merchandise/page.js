import ComingSoonSmall from "../_components/ComingSoonSmall";
const revalidate = 0;
function Page() {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div>
      {isDev && <ComingSoonSmall />}
      <div className="flex grid-cols-3">
        <div className="w-1/3"></div>
        <div className="w-1/3 text-center text-5xl mt-10">Merchandise</div>
        <div className="w-1/3"></div>
      </div>
    </div>
  );
}

export default Page;
