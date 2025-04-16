import { Base64UrlEncoder } from "next-base64-encoder";
import Link from "next/link";

async function Page({ searchParams }) {
  const { message, next } = await searchParams;
  let decodedMessage = null;
  if (message) {
    const base64UrlEncoder = new Base64UrlEncoder();
    const byteMessage = base64UrlEncoder.encode(message);
    decodedMessage = new TextDecoder().decode(byteMessage);
  }
  let nextPath = "/account/signup";
  let confirmationType = "sign up";
  switch (decodeURIComponent(next)) {
    case "/account/update-password":
      nextPath = "/account/reset-password";
      confirmationType = "reset password";
      break;
    case "/welcome":
      nextPath = "/account/signup";
      break;
  }
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-2xl font-semibold">
        Oops! Something went wrong with your {confirmationType} confirmation...
        🤒
      </h1>
      {decodedMessage && <p className="text-lg">{decodedMessage}</p>}
      <p className="text-lg">
        Please{" "}
        <Link className="font-bold" href={nextPath}>
          try again
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="font-bold">
          contact us
        </Link>
      </p>
    </main>
  );
}

export default Page;
