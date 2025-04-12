import Link from "next/link";

function ComingSoonSmall({ showSignUp }) {
  return (
    <div className="w-full text-center text-lg text-primary-400 mb-4">
      Coming Soon!
      {showSignUp ? (
        <Link
          href="/account/signup"
          className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-950"
        >
          Sign up now &rarr;
        </Link>
      ) : (
        " Sign up now "
      )}
      to receive an email and discount coupon when we open.
    </div>
  );
}

export default ComingSoonSmall;
