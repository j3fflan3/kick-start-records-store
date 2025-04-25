"use client";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import ProfileList from "../../_components/profile/ProfileList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileFields from "../../_components/profile/ProfileFields";
function Page() {
  const router = useRouter();
  const { session } = useSession();
  const [edit, setEdit] = useState(false);
  useEffect(
    function () {
      if (!session || (session && session?.user?.is_anonymous)) {
        router.push("/account/signin");
      }
    },
    [session, router]
  );
  return (
    <div className="flex grid-cols-3">
      <div className="w-1/4"></div>
      <div className="w-1/2">
        {session &&
          !session?.user?.is_anonymous &&
          (edit ? (
            <ProfileFields
              user={session.user.user_metadata}
              setEdit={setEdit}
            />
          ) : (
            <ProfileList user={session.user.user_metadata} setEdit={setEdit} />
          ))}
      </div>
      <div className="w-1/4"></div>
    </div>
    // <div className="flex flex-col gap-1 rounded-xl bg-gray-950/5 p-1 inset-ring inset-ring-gray-950/5 dark:bg-white/10 dark:inset-ring-white/10">
    //   <div className="overflow-auto rounded-lg bg-white outline outline-white/5 dark:bg-gray-950/50 p-8">
    // <div className="grid grid-cols-1">
    //   <div className="col-start-1 row-start-1 grid grid-flow-col grid-rows-3 gap-4 rounded-md text-center text-xl leading-6 font-medium dark:text-white">
    //     {session &&
    //       !session?.user?.is_anonymous &&
    //       `Hi, ${session.user.user_metadata.firstName} `}
    //   </div>
    // </div>
    //   </div>
    // </div>
  );
}

export default Page;
