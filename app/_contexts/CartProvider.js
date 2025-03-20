"use client";

import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useWebStorage } from "../_hooks/useWebStorage";
import { CartID } from "../_library/loadWebStorage";
import { dbAddToCart, dbUpdateCart } from "../_library/serverActions";

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
  function setCount(data) {
    // If data comes back null, set to 0
    const newCartCount = !data
      ? 0
      : data.reduce((sum, item) => sum + item.count, 0);
    setCartCount(newCartCount);
  }

  async function addToCart(catalogId, count = 1) {
    const { data, error } = await dbAddToCart(
      guestId,
      cartId,
      catalogId,
      count
    );
    if (error) {
      console.log(error);
      return;
    }
    setCount(data);
  }

  async function updateCart(catalogId, count, email = null) {
    const { data, error } = await dbUpdateCart(
      guestId,
      cartId,
      catalogId,
      count,
      email
    );
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
    console.log("CartProvider: finishing updateCart");
    setCount(data);
  }

  return (
    <CartContext.Provider
      value={{
        addToCart,
        updateCart,
        setLocalCartIds,
        createLocalCart,
        setCartCount,
        cartCount,
        localCartIds,
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
