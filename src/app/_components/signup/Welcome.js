"use client";
import useSessionMergeCart from "@/src/app/_hooks/useSessionMergeCart";

function Welcome() {
  const { user } = useSessionMergeCart();

  return (
    <div className="text-2xl font-bold">
      {user && <div>Welcome, {user.user_metadata.firstName}!</div>}
    </div>
  );
}

export default Welcome;
