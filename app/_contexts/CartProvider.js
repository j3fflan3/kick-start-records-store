"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbAddToCart, dbGetCart } from "../_library/serverActions";
import { CartID } from "../_library/loadWebStorage";
import { useWebStorageState } from "../_hooks/useWebStorageState";

const CartContext = createContext();

const localCartKey = "kickStartRecordsCart";

const createLocalCart = () => {
  return new CartID(uuidv4(), uuidv4(), new Date());
};

function CartProvider({ children }) {
  // useLocalStorage will check first for the existence of the local storage key.
  // If it does not exist, it will create it and store the value returned by
  // createLocalCart
  const [localCartIds, setLocalCartIds] = useWebStorageState(
    createLocalCart,
    localCartKey
  );

  const [cartCount, setCartCount] = useState(0);
  function setCount(data) {
    const newCartCount = data.reduce((sum, item) => sum + item.count, 0);
    setCartCount(newCartCount);
  }
  async function addToCart(catalogId, count = 1) {
    const { data, error } = await dbAddToCart(
      localCartIds.guestId,
      localCartIds.cartId,
      catalogId,
      count
    );
    if (error)
      throw new Error("There was a problem adding the item to your cart");
    setCount(data);
  }

  return (
    <CartContext.Provider
      value={{ addToCart, setCartCount, cartCount, localCartIds }}
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
