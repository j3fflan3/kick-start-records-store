// Returns either local or session storage (both implement Storage interface)
// Throws an error if neither are available
export function getWebStorage() {
  // From MDN.  Detects if localStorage is both supported and available
  function storageAvailable(type) {
    let storage;
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
        storage &&
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

export function CartID(guestId, cartId, expirationDate) {
  this.guestId = guestId;
  this.cartId = cartId;
  // Note that expiration dates will be used in terms of entire day,
  // not by the millisecond, etc.
  this.expirationDate = expirationDate;
}
