"use client";
import Link from "next/link";
import { useSession } from "@/src/app/_contexts/SessionProvider";

function ComingSoonSmall() {
  const session = useSession();
  const isSignedIn = session ? true : false;

  return (
    <div className="w-full text-center text-lg text-primary-400 mb-4">
      Coming Soon!
      {!isSignedIn && (
        <>
          <Link
            href="/account/verify-human"
            className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
          >
            Sign up now &rarr;
          </Link>

          <span> to receive an email and discount coupon when we open. </span>
        </>
      )}
    </div>
  );
}

export default ComingSoonSmall;
