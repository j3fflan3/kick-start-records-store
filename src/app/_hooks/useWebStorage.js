"use client";
import { useEffect, useState } from "react";
import { getWebStorage } from "@/src/app/_library/loadWebStorage";

// Right now, I'm kinda doing a catch all for the initialState / value
export function useWebStorage(key, initialState) {
  const [value, setValue] = useState(function () {
    const storage = getWebStorage();
    // Next.js hydrates first on the server, so check if window is undefined
    const storedValue = typeof window !== "undefined" && storage.getItem(key);
    // Definitely rethink this. Reading those ternary statements is overly complex
    // This doesn't need to be a catch all, but should have specific usage rules.
    // It should either be a function or an object
    // that gets JSON stringified on set and parsed on get
    return storedValue
      ? JSON.parse(storedValue)
      : initialState instanceof Function
      ? JSON.stringify(initialState())
      : typeof initialState === "string"
      ? initialState
      : JSON.stringify(initialState); // Assuming this is an object
  });

  useEffect(() => {
    if (value === undefined) return;
    const storage = getWebStorage();
    const item =
      value instanceof Function
        ? JSON.stringify(value())
        : typeof value === "string"
        ? value
        : JSON.stringify(value);
    storage.setItem(key, item);
  }, [key, value]);

  return [value, setValue];
}
