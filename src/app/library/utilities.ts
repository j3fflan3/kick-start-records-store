interface CartItem {
  count?: number;
  price: number;
  weight: number;
}

interface FormInput {
  validator: (value: unknown) => boolean;
  value: unknown;
  field: string;
  message: string;
}

function formatDollars(intCents: number): string {
  if (intCents <= 0) return "0.00";
  const dollarFloat = intCents / 100;
  return Number(dollarFloat).toFixed(2);
}

function calculateTax(taxPercentFloat: number, intCents: number): number {
  return Number(taxPercentFloat * intCents);
}

const itemsWeight = (items: CartItem[]): number => {
  const weight = items.reduce(
    (sum, item) => sum + (item?.count ?? 1) * item.weight,
    0
  );
  return weight;
};

const calculateTotal = (subtotalCents: number, ...shippingAndHandlingCents: number[]): string => {
  subtotalCents += [...shippingAndHandlingCents].reduce(
    (sum, item) => sum + item,
    0
  );
  return formatDollars(subtotalCents);
};

const itemsTotal = (items: CartItem[], ...shippingAndHandling: number[]): string => {
  let subtotal = items.reduce(
    (sum, item) => sum + (item?.count ?? 1) * item.price,
    0
  );
  console.log(
    `itemsTotal -> ${JSON.stringify([...shippingAndHandling], null, 2)}`
  );
  subtotal += [...shippingAndHandling].reduce((sum, item) => sum + item, 0);
  return formatDollars(subtotal);
};

const itemsTax = (items: CartItem[], taxPercentageFloat: number): number => {
  const subtotal = items.reduce(
    (sum, item) => sum + (item?.count ?? 1) * item.price,
    0
  );
  return calculateTax(taxPercentageFloat, subtotal);
};

const itemsCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    return sum + (item?.count ?? 1);
  }, 0);
};

const validatePassword = (password: string): boolean => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
    password
  );
};

const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

function validateForm(setErrors: (errors: Record<string, string>) => void, ...inputs: FormInput[]): boolean {
  const formError: Record<string, string> = {};
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

class shoppingCartKey {
  id: string;
  is_anonymous: boolean;
  expirationDate: unknown;
  constructor(id: string, is_anonymous: boolean, expirationDate: unknown) {
    this.id = id;
    this.is_anonymous = is_anonymous;
    this.expirationDate = expirationDate;
  }
}

function isDateExpired(startUnixEpoch: number, expirationSeconds: number): boolean {
  const expirationDate = new Date(startUnixEpoch + expirationSeconds * 1000);
  const now = new Date();
  return now > expirationDate;
}

function formatShortDate(dateString: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(dateString));
}

export {
  formatDollars,
  calculateTax,
  itemsTotal,
  calculateTotal,
  itemsTax,
  itemsCount,
  itemsWeight,
  validateEmail,
  validatePassword,
  validateForm,
  shoppingCartKey,
  isDateExpired,
  formatShortDate,
  type CartItem,
  type FormInput,
};
