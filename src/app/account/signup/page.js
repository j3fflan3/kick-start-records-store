import SignUp from "@/src/app/_components/signup/SignUp";

async function Page({ searchParams }) {
  const { captchaToken } = await searchParams;
  return <SignUp captchaToken={captchaToken} />;
}

export default Page;
