import Link from "next/link";
import Welcome from "../_components/signup/Welcome";

function Page() {
  return (
    <div className="flex flex-col items-center justify-normal mt-5 min-h-screen">
      <Welcome />
      <Link
        href="/"
        className="border border-primary-700 py-1 px-2 rounded-md mx-2 mt-2 text-lg font-bold inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
      >
        Continue Shopping &rarr;
      </Link>
    </div>
  );
}

export default Page;
