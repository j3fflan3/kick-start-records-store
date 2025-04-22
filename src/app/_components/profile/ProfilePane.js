"use client";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfilePane({ children }) {
  const router = useRouter();
  const { session } = useSession();
  console.log(session);
  useEffect(() => {
    // If no session go to login page
    if (!session) {
      router.push("/account/login");
    }
    // If user is anonymous, forward to home
    if (session?.user?.is_anonymous) {
      router.push("/");
    }
  }, [session, router]);
  if (!session) return <div>Loading...</div>;
  const {
    user: { user_metadata: userdata },
  } = session;

  return (
    <div className="col-span-7 row-span-3 justify-stretch grid place-content-start rounded-lg bg-primary-800 p-4">
      <div className="flex place-content-start text-xl pb-2">Account</div>
      {userdata && (
        <div className="flex justify-stretch w-full text-left pl-2 bg-primary-700">
          {userdata?.firstName}
        </div>
      )}
    </div>
  );
}

export default ProfilePane;
