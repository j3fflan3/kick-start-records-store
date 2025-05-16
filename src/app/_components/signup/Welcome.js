"use client";
import { useSession } from "../../_contexts/SessionProvider";

function Welcome() {
  const { session } = useSession();

  return (
    <div className="text-2xl font-bold">
      {session && !session.user.is_anonymous && (
        <div>Welcome, {session.user.user_metadata.firstName}!</div>
      )}
    </div>
  );
}

export default Welcome;
