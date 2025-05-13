"use client";

import { NavbarItem } from "@/src/app/_components/tailwind/navbar";
import useSessionMergeCart from "@/src/app/_hooks/useSessionMergeCart";
import { clientSignOut } from "@/src/app/_library/clientActions";
import { useRouter } from "next/navigation";

function HeaderLoginButton() {
  const { user, resetSessionMergeCart } = useSessionMergeCart();
  const router = useRouter();
  const loginHref = user ? "/account/profile" : "/account/signin";

  // Add a transition and SpinnerMini?
  function handleSignOut() {
    async function signOut() {
      await clientSignOut();
      // need to resetSessionMergeCart AFTER clientSignOut
      resetSessionMergeCart();
    }
    // clientSignOut is an async function, but we don't await it
    // so as to avoid an error if the user is on the profile
    // page.  Otherwise, account/profile expects a valid session,
    // and it throws an error and NEXT.js will redirect the main pane
    // to the Error.js and router.push("/") below might not be reached.
    // TODO: ☝🏻 This comment is a bit stale, but still need to rethink
    // if there is a better way to do this.
    signOut();
    router.push("/");
  }
  return (
    <>
      <NavbarItem key="login" href={loginHref}>
        {user ? `Hi, ${user.user_metadata.firstName}!` : "Log In/Join"}
      </NavbarItem>
      {user && (
        <NavbarItem key="logout" onClick={handleSignOut}>
          Log Out
        </NavbarItem>
      )}
    </>
  );
}

export default HeaderLoginButton;
