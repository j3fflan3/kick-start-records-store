import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">Not Found</h1>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className="inline-block bg-accent-600 rounded-md  text-primary-50 px-6 py-3 text-lg font-bold"
      >
        Go back home &rarr;
      </Link>
    </main>
  );
}

export default NotFound;
