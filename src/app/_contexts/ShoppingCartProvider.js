"use client";
import { useWebStorage } from "@/src/app/_hooks/useWebStorage";
import { clientAddToCart } from "@/src/app/_library/clientActions";
import { serverUpdateCart } from "@/src/app/_library/serverActions";
import { createContext, useState } from "react";
import { shoppingCartKey } from "../_library/utilities";

const ShoppingCartContext = createContext();
const localCartKey = "kickStartRecordsCart";
const createLocalShoppingCart = (id, is_anonymous) => {
  return new shoppingCartKey(id, is_anonymous, new Date());
};
function ShoppingCartProvider({ children }) {
  const [localCartIds, setLocalCartIds] = useWebStorage(
    localCartKey,
    createLocalShoppingCart
  );
  const { guestId, cartId } = localCartIds;
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

  async function addToCart(catalogId, count = 1) {
    // fnGetUserId,
    // const userId = fnGetUserId()
    const { data, error } = await clientAddToCart(
      guestId,
      cartId,
      catalogId,
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

  async function updateCart(catalogId, count, email = null) {
    let cnt = count;
    if (count > 10) {
      cnt = 10;
    }
    const { data, error } = await serverUpdateCart(
      guestId,
      cartId,
      catalogId,
      count,
      email
    );
    if (error) {
      console.log(error);
      return { data, error };
    }
    console.log(`data: ${JSON.stringify(data)}`);
    console.log("CartProvider: finishing updateCart");
    setCount(data);
    return { data, error };
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        addToCart,
        updateCart,
        setCartCount,
        cartCount,
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

function useShoppingCart() {}
export { ShoppingCartProvider, useShoppingCart };
