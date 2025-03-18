"use client";
import { useEffect, useState } from "react";
import { getWebStorage } from "../_library/loadWebStorage";

export function useWebStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storage = getWebStorage();
    // Next.js hydrates first on the server, so check if window is undefined
    const storedValue = typeof window !== "undefined" && storage.getItem(key);
    return storedValue
      ? JSON.parse(storedValue)
      : initialState instanceof Function
      ? initialState()
      : initialState;
  });

  useEffect(
    function () {
      try {
        if (value) {
          const storage = getWebStorage();
          storage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    [value, key]
  );

  return [value, setValue];
}
