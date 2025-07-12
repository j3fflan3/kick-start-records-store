function printRecordFormat(recordFormat) {
  // This should be remedied in PostgreSQL. Enums can have spaces.
  switch (recordFormat) {
    case "DigitalDownload":
    case "Digital Download":
      return "Download";
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

function formatDollars(intCents) {
  if (intCents <= 0) return "0.00";
  const dollarFloat = intCents / 100;
  return Number(dollarFloat).toFixed(2);
}

function calculateTax(taxPercentFloat, intCents) {
  return Number(taxPercentFloat * intCents);
}

const cartItemsWeight = (cart) => {
  const weight = cart.reduce((sum, item) => sum + item.count * item.weight, 0);
  return weight;
};

const cartTotal = (cart, ...shippingAndHandling) => {
  let subtotal = cart.reduce((sum, item) => sum + item.count * item.price, 0);
  console.log(`cartTotal -> ${[...shippingAndHandling]}`);
  subtotal += [...shippingAndHandling].reduce((sum, item) => sum + item, 0);
  return formatDollars(subtotal);
};

const cartTax = (cart, taxPercentageFloat) => {
  let subtotal = cart.reduce((sum, item) => sum + item.count * item.price, 0);
  return calculateTax(taxPercentageFloat, subtotal);
};

const cartItemCount = (cart) => {
  return cart.reduce((sum, item) => {
    return sum + item.count;
  }, 0);
};

const validatePassword = (password) => {
  // Password must be at least 8 characters in length and
  // contain at least one of the following: Uppercase letter, lowercase letter,
  // number, and special character (#?!@$%^&*-)
  // if (password && password.length < 8) return false;
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
    password
  );
};

const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

function validateForm(setErrors, ...inputs) {
  const formError = {};
  let isValid = true;
  for (const input of inputs) {
    if (!input.validator(input.value)) {
      formError[input.field] = input.message;
      isValid = false;
    }
  }
  setErrors(formError);
  return isValid;
}

function shoppingCartKey(id, is_anonymous, expirationDate) {
  this.id = id;
  this.is_anonymous = is_anonymous;
  this.expirationDate = expirationDate;
}

function getDateForUSPS() {
  const today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  const year = today.getFullYear();
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  return year + "-" + month + "-" + day;
}

function isDateExpired(startUnixEpoch, expirationSeconds) {
  const expirationDate = new Date(startUnixEpoch + expirationSeconds * 1000);
  const now = new Date();
  return now > expirationDate;
}

export {
  printRecordFormat,
  formatDollars,
  calculateTax,
  cartTotal,
  cartTax,
  cartItemCount,
  cartItemsWeight,
  validateEmail,
  validatePassword,
  validateForm,
  shoppingCartKey,
  getDateForUSPS,
  isDateExpired,
};
