"use client";
import { useSession } from "../../_contexts/SessionProvider";
import Error from "../../error";

function Welcome() {
  const { session } = useSession();
  if (!session) {
    return <div>Session not found</div>;
  }
  return (
    <div className="text-2xl font-bold">
      {session && <div>Welcome, {session.user.user_metadata.firstName}!</div>}
    </div>
  );
}

export default Welcome;
