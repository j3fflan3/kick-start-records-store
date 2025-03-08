import Link from "next/link";
// import { auth } from "../_lib/auth";

export default async function Navigation() {
  //   const session = await auth();
  // session = { user: { name, email, image }, expires }
  const session = false;
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
            href="/clothing"
            className="hover:text-accent-400 transition-colors"
          >
            Clothing
          </Link>
        </li>
        <li>
          <Link
            href="/artists"
            className="hover:text-accent-400 transition-colors"
          >
            Artists
          </Link>
        </li>
        <li>
          <Link
            href="/labels"
            className="hover:text-accent-400 transition-colors"
          >
            Labels
          </Link>
        </li>
        <li>
          {/* {session?.user?.image ? ( */}
          {session ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <img
                className="h-8 rounded-full"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>Guest Area</span>
            </Link>
          ) : (
            <Link
              href="/about"
              className="hover:text-accent-400 transition-colors"
            >
              About
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
