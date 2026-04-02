"use client";
import { useWebStorage } from "@/src/app/hooks/useWebStorage";
import {
  clientAddToShoppingCart,
  clientMergeShoppingCarts,
  clientGetShoppingCart,
  clientUpdateShoppingCart,
} from "@/src/app/library/client/shoppingCart";
import { createContext, useContext, useEffect, useState } from "react";
import { shoppingCartKey } from "../library/utilities";
import { useSession } from "./SessionProvider";
import { revalidatePathForClient } from "../library/server/utilities";

const ShoppingCartContext = createContext();
const localCartKey = "ksrShoppingCart";

const initialCart = {
  id: "",
  is_anonymous: null,
  expirationDate: null,
};
function ShoppingCartProvider({ children }) {
  const [localCartIds, setLocalCartIds] = useWebStorage(
    localCartKey,
    initialCart
  );
  const [cartCount, setCartCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [cartLink, setCartLink] = useState(null);

  const { session } = useSession();
  const user = session && session.user;
  const cartUserId = localCartIds.id;

  // update anytime the user changes
  useEffect(() => {
    async function mergeCarts(anonUserId, userId) {
      // console.log(
      //   `ShoppingCartProvider -> mergeCarts: anonUserId: ${anonUserId}, userId: ${userId}`
      // );
      const { data } = await clientMergeShoppingCarts(anonUserId, userId);
      setCount(data);
      // set localCartIds
      setLocalCartIds(createLocalShoppingCart(userId, false));
    }

    if (user) {
      // console.log(
      //   `ShoppingCartProvider::useEffect -> user: ${JSON.stringify(
      //     user
      //   )}, anonCartUserId: ${cartUserId}`
      // );
      // If user was anonymous, logged in cart was merged, the localStorage was updated,
      // we want to exit to avoid a loop
      if (!user.is_anonymous && user.id === cartUserId) return;
      // if the user has logged in and the previous logged in user was anonymous
      // merge the carts
      if (!user.is_anonymous && cartUserId) {
        mergeCarts(cartUserId, user.id);
      } else {
        // If the user changes, update the localCartIds.
        setLocalCartIds(createLocalShoppingCart(user.id, user.is_anonymous));
      }
    }
  }, [user, setLocalCartIds, cartUserId]);

  function setCount(products) {
    // If products is null, set to 0
    const newCartCount = !products
      ? 0
      : products.reduce((sum, item) => sum + item.count, 0);
    setCartCount(newCartCount);
  }

  function createLocalShoppingCart(id = null, is_anonymous = null) {
    let date = new Date();
    date.setDate(date.getDate() + 30);
    return () => {
      return new shoppingCartKey(id, is_anonymous, date);
    };
  }
  async function addToShoppingCart(catalogId, is_anonymous, count = 1) {
    console.log(
      `ShoppingCartProvider.js -> addToShoppingCart("${catalogId}", ${is_anonymous}, ${count})`
    );
    const { data, error } = await clientAddToShoppingCart(
      catalogId,
      is_anonymous,
      count
    );
    if (error) {
      console.log(error);
      return { data, error };
    }
    // console.log(`data: ${JSON.stringify(data)}`);
    setCount(data);
    revalidatePathForClient("/cart");
    return { data, error };
  }
  async function getShoppingCart() {
    const { data, error } = await clientGetShoppingCart();
    if (error) {
      console.log(error.message);
      return { data };
    }
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    setCount(data);
    return { data };
  }
  async function updateShoppingCart(catalogId, count, email = null) {
    let cnt = count;
    if (count > 10) {
      cnt = 10;
    }
    const { data, error } = await clientUpdateShoppingCart(
      catalogId,
      count,
      email
    );
    if (error) {
      console.log(error);
      return { data, error };
    }
    // console.log(`data: ${JSON.stringify(data)}`);
    // console.log("CartProvider: finishing updateShoppingCart");
    setCount(data);
    revalidatePathForClient("/cart");
    return { data, error };
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        addToShoppingCart,
        getShoppingCart,
        updateShoppingCart,
        setCartCount,
        cartCount,
        setLocalCartIds,
        createLocalShoppingCart, // Used to update/reset the local storage cart json
        localCartIds,
        setOpenCart, // Used by AddToCart.js to open cart slider, populate
        setCartItem,
        setCartLink,
        openCart, // Used by AddToCartSlider.js to give state to slider
        cartItem,
        cartLink,
        setCount,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined)
    throw new Error("ShoppingCartContext used outside of provider");
  return context;
}
export { ShoppingCartProvider, useShoppingCart };
