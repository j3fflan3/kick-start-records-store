"use client";

import { NavbarItem } from "@/src/app/_components/tailwind/navbar";
import { clientSignOut } from "@/src/app/_library/clientActions";
import { useRouter } from "next/navigation";
import { useSession } from "../../_contexts/SessionProvider";
import { useShoppingCart } from "../../_contexts/ShoppingCartProvider";

function HeaderLoginButton() {
  const { session } = useSession();
  const { setCount } = useShoppingCart();
  const router = useRouter();
  const loginHref =
    session && !session.user.is_anonymous
      ? "/account/profile"
      : "/account/signin";

  // Add a transition and SpinnerMini?
  function handleSignOut() {
    async function signOut() {
      await clientSignOut();
      // Clear out the cart number
      setCount(null);
      console.log("after await clientSignOut");
    }
    // clientSignOut is an async function, but we don't await it
    // so as to avoid an error if the user is on the profile
    // page.  Otherwise, account/profile expects a valid session,
    // and it throws an error and NEXT.js will redirect the main pane
    // to the Error.js and router.push("/") below might not be reached.
    // TODO: ☝🏻 This comment is a bit stale, but still need to rethink
    // if there is a better way to do this.
    signOut();
    console.log('before router.push("/")');
    router.push("/");
  }
  return (
    <>
      <NavbarItem key="login" href={loginHref}>
        {session && !session.user.is_anonymous
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
