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
  const dollarFloat = intCents / 100;
  let dollars = String(Number(parseFloat(dollarFloat)));
  if (dollars.indexOf(".") === dollars.length - 2) {
    dollars += "0";
  }
  return dollars;
}

const cartSubtotal = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.count * item.price, 0);
  return formatDollars(subtotal);
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

export {
  printRecordFormat,
  formatDollars,
  cartSubtotal,
  cartItemCount,
  validateEmail,
  validatePassword,
  validateForm,
  shoppingCartKey,
};
