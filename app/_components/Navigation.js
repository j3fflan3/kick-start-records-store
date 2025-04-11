"use client";
import Link from "next/link";
import { useSession } from "../_contexts/SessionProvider";
import CartIcon from "./CartIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clientSignOut } from "../_library/clientActions";
import { Toaster } from "react-hot-toast";

export default function Navigation() {
  const context = useSession();
  const { session } = context;
  const router = useRouter();

  // Add a transition and SpinnerMini?
  async function handleSignOut() {
    await clientSignOut();
    router.push("/");
  }

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/records"
            className="hover:text-accent-400 transition-colors"
          >
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
          {session && !session?.user?.is_anonymous ? (
            <Link href="/account/profile">
              Hi, {session.user.user_metadata.firstName}!
            </Link>
          ) : (
            <Link
              href="/account/login"
              className="hover:text-accent-400 transition-colors"
            >
              Log In/Sign Up
            </Link>
          )}
        </li>
        <li>
          {session && !session.user.is_anonymous && (
            <button onClick={handleSignOut}>Log Out</button>
          )}
        </li>
        <li>
          <CartIcon />
        </li>{" "}
      </ul>
      <Toaster />
    </nav>
  );
}
