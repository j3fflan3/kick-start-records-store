// Returns either local or session storage (both implement Storage interface)
// returns null if neither are available
export function getWebStorage(): Storage | null {
  // This func is from MDN.  Detects if localStorage is both supported and available
  function storageAvailable(type: "localStorage" | "sessionStorage"): boolean {
    let storage: Storage | undefined;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage !== undefined &&
        storage.length !== 0
      );
    }
  }

  if (storageAvailable("localStorage")) {
    // We can use localStorage
    return window.localStorage;
  } else if (storageAvailable("sessionStorage")) {
    // We can use sessionStorage instead
    return window.sessionStorage;
  }
  return null;
}

export class CartID {
  guestId: string;
  cartId: string;
  // Note that expiration dates will be used in terms of entire day,
  // not by the millisecond, etc.
  expirationDate: unknown;

  constructor(guestId: string, cartId: string, expirationDate: unknown) {
    this.guestId = guestId;
    this.cartId = cartId;
    this.expirationDate = expirationDate;
  }
}
