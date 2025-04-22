"use client";
import LeftNavbar from "@/src/app/_components/profile/LeftNavbar";
import ProfilePane from "@/src/app/_components/profile/ProfilePane";
import { useSession } from "@/src/app/_contexts/SessionProvider";
function Page() {
  const { session } = useSession();
  console.log(session);
  return (
    // <div className="flex flex-col gap-1 rounded-xl bg-gray-950/5 p-1 inset-ring inset-ring-gray-950/5 dark:bg-white/10 dark:inset-ring-white/10">
    //   <div className="overflow-auto rounded-lg bg-white outline outline-white/5 dark:bg-gray-950/50 p-8">
    <div className="grid grid-cols-1">
      <div className="col-start-1 row-start-1 grid grid-flow-col grid-rows-3 gap-4 rounded-md text-center text-xl leading-6 font-medium dark:text-white">
        {session &&
          !session?.user?.is_anonymous &&
          `Hi, ${session.user.user_metadata.firstName} `}
      </div>
    </div>
    //   </div>
    // </div>
  );
}

export default Page;
