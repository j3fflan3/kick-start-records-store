import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">Not Found</h1>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className="inline-block bg-accent-200 text-primary-800 px-6 py-3 text-lg"
      >
        Go back home
      </Link>
    </main>
  );
}

export default NotFound;
