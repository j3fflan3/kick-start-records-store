"use client";
import { useSession } from "@/src/app/_contexts/SessionProvider";

function LoggedInUser() {
  const { session } = useSession();
  return (
    <div>{session && <div>{session?.user?.user_metadata?.firstName}</div>}</div>
  );
}

export default LoggedInUser;
