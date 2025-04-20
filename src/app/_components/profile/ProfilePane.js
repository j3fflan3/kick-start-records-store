"use client";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfilePane({ children }) {
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/account/login");
    }
  }, [session, router]);

  const {
    user: { user_metadata: userdata },
  } = session;

  return (
    <div className="col-span-3 row-span-3 grid place-content-start rounded-lg bg-primary-800 p-4">
      <div className="flex justify-stretch place-content-center text-xl">
        Account
      </div>
      {userdata && (
        <div className="w-full justify-stretch bg-primary-700">
          {userdata?.firstName}
        </div>
      )}
    </div>
  );
}

export default ProfilePane;
