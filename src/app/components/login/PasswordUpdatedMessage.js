"use client";
import Link from "next/link";

function PasswordUpdatedMessage() {
  return (
    <div className="w-full text-center text-lg text-primary-400 mb-12">
      Your password has been updated.
      <Link
        href="/"
        className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
      >
        Continue shopping &rarr;
      </Link>
    </div>
  );
}

export default PasswordUpdatedMessage;
