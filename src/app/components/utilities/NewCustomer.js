import Link from "next/link";

async function NewCustomer() {
  return (
    <div className="w-full text-center text-lg text-primary-400 mb-12">
      New Customer?
      <Link
        href="/account/verify-human"
        className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
      >
        Sign up now &rarr;
      </Link>
      Or
      <Link
        href="/account/signin"
        className="border border-primary-700 py-1 px-2 rounded-md mx-2 text-lg inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
      >
        Log in &rarr;
      </Link>
    </div>
  );
}

export default NewCustomer;
