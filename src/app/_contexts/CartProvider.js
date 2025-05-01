"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { clientAddToCart } from "@/src/app/_library/clientActions";
import { CartID } from "@/src/app/_library/loadWebStorage";
import { useWebStorage } from "@/src/app/_hooks/useWebStorage";
import { serverUpdateCart } from "@/src/app/_library/serverActions";

const CartContext = createContext();

const localCartKey = "kickStartRecordsCart";

const createLocalCart = () => {
  return new CartID(uuidv4(), uuidv4(), new Date());
};

function CartProvider({ children }) {
  // useLocalStorage will check first for the existence of the local storage key.
  // If it does not exist, it will create it and store the value returned by
  // createLocalCart
  const [localCartIds, setLocalCartIds] = useWebStorage(
    localCartKey,
    createLocalCart
  );
  const { guestId, cartId } = localCartIds;
  const [cartCount, setCartCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [cartLink, setCartLink] = useState(null);

  function setCount(data) {
    // If data comes back null, set to 0
    const newCartCount = !data
      ? 0
      : data.reduce((sum, item) => sum + item.count, 0);
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
    <CartContext.Provider
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
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error("CartContext used outside of provider");
  return context;
}

export { CartProvider, useCart };
