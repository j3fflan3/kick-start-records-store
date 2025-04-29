import Link from "next/link";

async function Page({ params }) {
  const { message } = await params;
  return (
    <div className="text-base/6 pb-2 pl-1 text-center font-medium">
      {message === "success" &&
        "You're account has been deleted. We're sorry to see you go."}
      {message === "error" && (
        <p>
          There was an error deleting your account.
          <Link
            href="/account/profile"
            className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
          >
            Try Again &rarr;
          </Link>
        </p>
      )}
    </div>
  );
}

export default Page;
