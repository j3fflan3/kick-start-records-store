"use client";

import { useCart } from "../_contexts/CartProvider";

function AddToCart({ catalogId, disabled }) {
  const context = useCart();
  const { addToCart } = context;

  function handleAddToCart() {
    addToCart(catalogId);
  }
  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className="bg-accent-700 mb-3 mt-3 mr-4 ml-4 px-3 py-1 border-primary-500 rounded-md"
    >
      Add To Cart
    </button>
  );
}

export default AddToCart;
