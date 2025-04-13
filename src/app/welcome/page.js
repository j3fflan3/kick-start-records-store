"use client";

import { useSession } from "@/src/app/_contexts/SessionProvider";

async function Page() {
  const { session } = useSession();

  if (!session) return <Error error={{ message: "Sign Up failed." }} />;
  return (
    <div>
      {session && <div>Welcome, {session.user.user_metadata.firstName}!</div>}
    </div>
  );
}

export default Page;
