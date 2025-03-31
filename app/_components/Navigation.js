"use client";
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useSession } from "../_contexts/SessionProvider";

// import { auth } from "../_lib/auth";

export default function Navigation() {
  const session = useSession();
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link href="/" className="hover:text-accent-400 transition-colors">
            Records
          </Link>
        </li>
        <li>
          <Link
            href="/merchandise"
            className="hover:text-accent-400 transition-colors"
          >
            Merch
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session ? (
            <Link href="/profile">
              Hi, {session.user.user_metadata.firstName}!
            </Link>
          ) : (
            <Link
              href="/login"
              className="hover:text-accent-400 transition-colors"
            >
              Log In
            </Link>
          )}
        </li>
        <li>
          <CartIcon />
        </li>{" "}
      </ul>
    </nav>
  );
}
