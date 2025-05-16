import { useEffect, useState } from "react";
import { useSession } from "../_contexts/SessionProvider";
import { clientSignInAnonymously } from "../_library/clientActions";
import { useShoppingCart } from "../_contexts/ShoppingCartProvider";

function useAnonymousSessionCart() {
  const [user, setUser] = useState(null);
  const [done, setDone] = useState(false);

  const { session } = useSession();
  console.log(session);
  const { setLocalCartIds, createLocalShoppingCart, getShoppingCart } =
    useShoppingCart();

  function resetAnonymousSessionCart() {
    setUser(null);
    setDone(false);
  }

  useEffect(() => {
    async function signInAnonymously() {
      const { data, error } = await clientSignInAnonymously();
      if (error) {
        console.log(error);
        return;
      }
      setUser(data.user);
      const { id: userId } = data.user;
      // go ahead and store the anon userId in the cart
      setLocalCartIds(createLocalShoppingCart(userId, true));
      // refresh the cart
      const { error: getShoppingCartError } = await getShoppingCart();
      if (getShoppingCartError) {
        console.log(getShoppingCartError.message);
      }
      setDone(true);
    }
    console.log("useAnonymousSessionCart fired");
    // If we don't have a session, sign-in anonymously
    if (!session && !done) {
      console.log("useAnonymousSessionCart -> signInAnonymously");
      signInAnonymously();
    } else if (session && !done) {
      console.log("useAnonymousSessionCart -> session exists and !done");
      setUser(session.user);
      setDone(true);
    }
  }, [
    session,
    done,
    setLocalCartIds,
    createLocalShoppingCart,
    getShoppingCart,
  ]);

  return { user, resetAnonymousSessionCart };
}

export { useAnonymousSessionCart };
