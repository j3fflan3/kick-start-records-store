"use client";
import { useEffect, useState } from "react";
import { clientMergeCarts } from "@/src/app/_library/clientActions";
import { useSession } from "@/src/app/_contexts/SessionProvider";
import { useShoppingCart } from "@/src/app/_contexts/ShoppingCartProvider";

// Call this hook immediately after logging in (whether via confirming signup
// at @/src/app/_components/signup/Welcome.js,
// or the @/src/app/_components/header/HeaderLoginButton.js)
/**
 * @callback resetSessionMergeCart - Used for resetting useSessionMergeCart after sign out
 */
/**
 * useSessionMergeCart checks to see if the current user had been logged in anonymously
 before they signed in with their email and password.  If so, it checks if they
 had added items to their cart when signed in anonymously.  If they had, it calls
 a mergeCarts which will add the anonymous cart items to their signed in user's cart.
 * @returns {{user: object, resetSessionMergeCart: function}} the user object from the current session, and a resetSessionMergeCart callback
 */
function useSessionMergeCart() {
  const [user, setUser] = useState(null);
  const [done, setDone] = useState(false);
  const { session } = useSession();
  const { localCartIds, setLocalCartIds, createLocalShoppingCart } =
    useShoppingCart();

  function resetSessionMergeCart() {
    setUser(null);
    setDone(false);
  }
  useEffect(() => {
    async function mergeCarts(anonUserId, userId) {
      await clientMergeCarts(anonUserId, userId);
      // set localCartIds
      setLocalCartIds(createLocalShoppingCart(userId, false));
    }
    if (session && !session.user.is_anonymous && !done) {
      setDone(true); // prevent continual loop due to localCartIds being updated
      setUser(session.user);
      const { id: userId } = session.user;
      if (localCartIds.is_anonymous) {
        const { id: anonUserId } = localCartIds;
        // merge anonymous cart with users cart (if either exists)
        mergeCarts(anonUserId, userId);
      } else {
        setLocalCartIds(createLocalShoppingCart(userId, false));
      }
    }
  }, [session, createLocalShoppingCart, localCartIds, setLocalCartIds, done]);
  // returning setUser in order to set user to null upon sign out.
  return { user, resetSessionMergeCart };
}

export default useSessionMergeCart;
