"use client";
import { useWebStorage } from "@/src/app/_hooks/useWebStorage";
import { clientAddToShoppingCart } from "@/src/app/_library/clientActions";
import { serverUpdateShoppingCart } from "@/src/app/_library/serverActions";
import { createContext, useContext, useState } from "react";
import { shoppingCartKey } from "../_library/utilities";
import { useSession } from "./SessionProvider";

const ShoppingCartContext = createContext();
const localCartKey = "ksrShoppingCart";

const initialCart = {
  id: "",
  is_anonymous: null,
  expirationDate: null,
};
function ShoppingCartProvider({ children }) {
  const { session } = useSession();

  const [localCartIds, setLocalCartIds] = useWebStorage(
    localCartKey,
    initialCart
  );
  console.log(`localCartIds: ${JSON.stringify(localCartIds)}`);
  const { id, is_anonymous, expirationDate } = localCartIds;
  const [cartCount, setCartCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [cartLink, setCartLink] = useState(null);

  function setCount(products) {
    // If products is null, set to 0
    const newCartCount = !products
      ? 0
      : products.reduce((sum, item) => sum + item.count, 0);
    setCartCount(newCartCount);
  }

  function createLocalShoppingCart(id = null, is_anonymous = null) {
    return () => {
      return new shoppingCartKey(id, is_anonymous, new Date());
    };
  }
  async function addToShoppingCart(catalogId, is_anonymous, count = 1) {
    const { data, error } = await clientAddToShoppingCart(
      catalogId,
      is_anonymous,
      count
    );
    if (error) {
      console.log(error);
      return { data, error };
    }
    console.log(`data: ${JSON.stringify(data)}`);
    setCount(data);
    return { data, error };
  }

  async function updateShoppingCart(catalogId, count, email = null) {
    let cnt = count;
    if (count > 10) {
      cnt = 10;
    }
    const { data, error } = await serverUpdateShoppingCart(
      catalogId,
      count,
      email
    );
    if (error) {
      console.log(error);
      return { data, error };
    }
    console.log(`data: ${JSON.stringify(data)}`);
    console.log("CartProvider: finishing updateShoppingCart");
    setCount(data);
    return { data, error };
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        addToShoppingCart,
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
