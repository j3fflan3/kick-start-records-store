import ResendConfirmation from "@/src/app/_components/login/ResendConfirmation";
import SignUpConfirmation from "@/src/app/_components/signup/SignUpConfirmation";

export default async function Page({ params, searchParams }) {
  const { email } = await params;
  const { captchaToken, action } = await searchParams;
  const decodedEmail = decodeURIComponent(email);
  return (
    <div className="w-full text-center text-lg dark:text-primary-400 mb-4">
      {action === "signup" && <SignUpConfirmation showNote={captchaToken} />}{" "}
      <ResendConfirmation email={decodedEmail} action={action}>
        {action === "reset" && (
          <>
            <p className="text-left pb-0 text-lg font-medium dark:text-primary-200">
              <span className="font-semibold">
                Check your email for a link to update your password.
              </span>{" "}
              If you don&apos;t see the email, please check your spam or junk
              folder.
            </p>
          </>
        )}
      </ResendConfirmation>
    </div>
  );
}
