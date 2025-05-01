"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../../_contexts/SessionProvider";
import { NavbarItem } from "../tailwind/navbar";
import { clientSignOut } from "@/src/app/_library/clientActions";

function HeaderLoginButton() {
  const { session } = useSession();
  // console.log(session);
  const router = useRouter();
  const loginHref =
    session && !session?.user?.is_anonymous
      ? "/account/profile"
      : "/account/signin";

  // Add a transition and SpinnerMini?
  function handleSignOut() {
    // clientSignOut is an async function, but we don't await it
    // so as to avoid an error if the user is on the profile
    // page.  Otherwise, account/profile expects a valid session,
    // and it throw an error and NEXT.js will redirect the main pane
    // to the Error.js and router.push("/") below might not be reached.
    clientSignOut();
    router.push("/");
  }
  return (
    <>
      <NavbarItem key="login" href={loginHref}>
        {session && !session?.user?.is_anonymous
          ? `Hi, ${session.user.user_metadata.firstName}!`
          : "Log In/Join"}
      </NavbarItem>
      {session && !session.user.is_anonymous && (
        <NavbarItem key="logout" onClick={handleSignOut}>
          Log Out
        </NavbarItem>
      )}
    </>
  );
}

export default HeaderLoginButton;
