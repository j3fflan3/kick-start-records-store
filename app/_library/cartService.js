"use client";
import { v4 as uuidv4 } from "uuid";
import { dbAddToCart } from "./serverActions";

function getOrCreateLocalCart() {
  let localCart = localStorage.getItem("kickStartRecordsCart");
  if (localCart !== null) return JSON.parse(localCart);
  // Otherwise, we need new ids
  const guestId = uuidv4();
  const cartId = uuidv4();
  localCart = {
    guestId: guestId,
    cartId: cartId,
  };
  localStorage.setItem("kickStartRecordsCart", JSON.stringify(localCart));
  return localCart;
}

export async function addToCart(catalogId, count = 1) {
  const localCart = getOrCreateLocalCart();
  console.log(localCart);
  const { data, error } = await dbAddToCart(
    localCart.guestId,
    localCart.cartId,
    catalogId,
    count
  );
  if (error) {
    // handle the client error
    console.log(error.message);
    throw new Error("There was an error adding to your cart");
  }
  console.log(data);
  return data;
}
