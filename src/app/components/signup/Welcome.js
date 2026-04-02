"use client";
import Link from "next/link";
import { useSession } from "../../contexts/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { time } from "framer-motion";

function Welcome() {
  const { session } = useSession();
  const router = useRouter();
  const continueCheckout =
    session &&
    !session.user.is_anonymous &&
    session.user.user_metadata.continueCheckout;
  console.log(
    `Welcome -> continueCheckout: ${
      session && !session.user.is_anonymous
        ? session.user.user_metadata.continueCheckout
        : "continueCheckout doesn't exist"
    }`
  );
  useEffect(() => {
    function onTimeout() {
      router.push("/checkout/payment");
    }

    let timeoutId = null;
    if (continueCheckout) {
      timeoutId = setTimeout(onTimeout, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [continueCheckout, router]);

  const hrefURL = continueCheckout ? "/checkout/payment" : "/";
  return (
    <div className="text-2xl font-bold text-center">
      {session && !session.user.is_anonymous && (
        <p>Welcome, {session.user.user_metadata.firstName}!</p>
      )}
      {continueCheckout && (
        <p className="text-justify text-lg">
          In a few moments you will be forwarded to checkout, or click the link
          below.
        </p>
      )}
      <Link
        href={hrefURL}
        className="border border-primary-700 py-1 px-2 rounded-md mx-2 mt-2 text-lg font-bold inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
      >
        Continue {continueCheckout ? "to Checkout" : "Shopping"} &rarr;
      </Link>
    </div>
  );
}

export default Welcome;
