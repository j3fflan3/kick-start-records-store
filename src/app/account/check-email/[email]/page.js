import ResendConfirmation from "@/src/app/_components/ResendConfirmation";

export default async function Page({ params }) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);
  return (
    <div className="w-full text-center text-lg text-primary-400 mb-4">
      <h1>Check Your Email</h1>
      <p>
        Please check your email for a confirmation link to complete your account
        setup.
      </p>
      <p>
        If you don&apos;t see the email, please check your spam or junk folder.{" "}
        <i>
          Note: you won&apos;t receive another confirmation if you are already
          signed up.
        </i>
      </p>
      <ResendConfirmation email={decodedEmail} />
    </div>
  );
}
