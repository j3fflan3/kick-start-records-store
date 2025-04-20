"use client";
import CartIcon from "@/src/app/_components/cart/CartIcon";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { clientSignOut } from "@/src/app/_library/clientActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
              Log In/Join
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
    </nav>
  );
}
