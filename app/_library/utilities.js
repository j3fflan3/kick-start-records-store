function printRecordFormat(recordFormat) {
  switch (recordFormat) {
    case "DigitalDownload":
      return "Digital Download";
    case "VinylLP":
      return "Vinyl LP";
    case "VinylEP":
      return "Vinyl EP";
    case "VinylSingle":
      return "Vinyle Single";
    case "CD":
    case "Cassette":
    default:
      return recordFormat;
  }
}

function formatDecimal(intCents) {
  return Number(parseFloat(intCents));
}

const cartSubtotal = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.count * item.price, 0);
  return formatDecimal(subtotal / 100);
};

const cartItemCount = (cart) => {
  return cart.reduce((sum, item) => {
    return sum + item.count;
  }, 0);
};
export { printRecordFormat, formatDecimal, cartSubtotal, cartItemCount };

const validatePassword = (pwd) => {
  // Password must be at least 8 characters in length and
  // contain at least one of the following: Uppercase letter, lowercase letter,
  // number, and special character (#?!@$%^&*-)
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
    pwd
  );
};
