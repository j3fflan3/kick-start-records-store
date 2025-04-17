"use client";
// Error boundary must always be a client component
// Only rendering errors are caught by this error boundary in
// NextJS.  It will not catch errors in callback functions, for
// example.  It also does not catch errors in the root layout.
export default function Error({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">
        Oops! Something went wrong... 🤒
      </h1>
      <p className="text-lg">{error.message}</p>
    </main>
  );
}
