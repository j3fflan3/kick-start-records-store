import ResendConfirmation from "@/src/app/_components/login/ResendConfirmation";
import SignUpConfirmation from "@/src/app/_components/signup/SignUpConfirmation";

export default async function Page({ params, searchParams }) {
  const { email } = await params;
  const { captchaToken, action } = await searchParams;
  const decodedEmail = decodeURIComponent(email);
  return (
    <div className="w-full text-center text-lg dark:text-primary-400 mb-4">
      {action === "signup" && <SignUpConfirmation showNote={captchaToken} />}{" "}
      {action === "reset" && (
        <>
          <p className="text-justify pb-0 text-xl font-semibold text-primary-200">
            Check your email for a link to update your password.
          </p>
          <p className="text-justify pb-0 text-xl text-primary-300">
            If you don&apos;t see the email, please check your spam or junk
            folder.
          </p>
        </>
      )}
      <ResendConfirmation email={decodedEmail} action={action} />
    </div>
  );
}
