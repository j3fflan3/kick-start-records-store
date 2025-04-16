function SignUpConfirmation({ showNote }) {
  return (
    <div>
      <p>
        Please check your email for a confirmation link to complete your account
        setup.
      </p>
      <p>
        If you don&apos;t see the email, please check your spam or junk folder.{" "}
        {showNote && (
          <i>
            Note: you won&apos;t receive another confirmation if you are already
            signed up.
          </i>
        )}
      </p>
    </div>
  );
}

export default SignUpConfirmation;
