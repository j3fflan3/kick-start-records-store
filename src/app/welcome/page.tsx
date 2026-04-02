import Link from "next/link";
import Welcome from "../components/signup/Welcome";

function Page() {
  return (
    <div className="flex flex-col items-center justify-normal mt-5 min-h-screen">
      <Welcome />
    </div>
  );
}

export default Page;
