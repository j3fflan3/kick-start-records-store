"use client";

import { useRouter } from "next/navigation";
import { NavbarItem } from "@/src/app/_components/tailwind/navbar";
import { clientSignOut } from "@/src/app/_library/client/user";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";
import { UserIcon } from "@heroicons/react/24/solid";

function HeaderSignInButton() {
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
        {session && !session.user.is_anonymous ? (
          <>
            <UserIcon />
            <span>Hi, {session.user.user_metadata.firstName}!</span>
          </>
        ) : (
          "Sign In/Join"
        )}
      </NavbarItem>
      {session && !session.user.is_anonymous && (
        <NavbarItem key="logout" onClick={handleSignOut}>
          Sign Out
        </NavbarItem>
      )}
    </>
  );
}

export default HeaderSignInButton;
