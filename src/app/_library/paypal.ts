// PayPal related objects
const CAPTURE = "CAPTURE";
const NO_CONTACT_INFO = "NO_CONTACT_INFO";
const NO_PREFERENCE = "NO_PREFERENCE";
const PAY_NOW = "PAY_NOW";
const IMMEDIATE_PAYMENT_REQUIRED = "IMMEDIATE_PAYMENT_REQUIRED";
const KICK_START_RECORDS = "Kickstart Records";
const DIGITAL_GOODS = "DIGITAL_GOODS";
const PHYSICAL_GOODS = "PHYSICAL_GOODS";
const DEFAULT_CURRENCY_CODE = "USD";
const GET_FROM_FILE = "GET_FROM_FILE";
const NO_SHIPPING = "NO_SHIPPING";

interface IPayPalUPC {
  type: string;
  code: string;
}

class PayPalUPC {
  type: string;
  code: string;

  constructor(type: string, code: string) {
    this.type = type;
    this.code = code;
  }
}
interface IPayPalItem {
  name: string;
  quantity: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  unit_amout: IPayPalSimpleAmount;
  tax: IPayPalSimpleAmount;
  sku: string;
  upc: IPayPalUPC;
}

class PayPalItem {
  name: string;
  quantity: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  unit_amount: IPayPalSimpleAmount;
  tax: IPayPalSimpleAmount;
  sku: string;
  upc: IPayPalUPC;

  constructor(
    name: string,
    quantity: string,
    description: string,
    category: string,
    url: string,
    image_url: string,
    unit_amount: IPayPalSimpleAmount, // type IPayPalSimpleAmount
    tax: IPayPalSimpleAmount, // type IPayPalSimpleAmount
    sku: string,
    upc: IPayPalUPC // type IPayPalUPC
  ) {
    this.name = name;
    this.quantity = quantity;
    this.description = description;
    this.category = category;
    this.url = url;
    this.image_url = image_url;
    this.unit_amount = unit_amount;
    this.tax = tax;
    this.sku = sku;
    this.upc = upc;
  }
}

interface IPayPalBreakdown {
  item_total: IPayPalSimpleAmount;
  shipping: IPayPalSimpleAmount;
  handling: IPayPalSimpleAmount;
  tax_total: IPayPalSimpleAmount;
  shipping_discount: IPayPalSimpleAmount;
  discount: IPayPalSimpleAmount;
  insurance: IPayPalSimpleAmount;
}
class PayPalBreakdown {
  item_total: IPayPalSimpleAmount;
  shipping: IPayPalSimpleAmount;
  handling: IPayPalSimpleAmount;
  tax_total: IPayPalSimpleAmount;
  shipping_discount: IPayPalSimpleAmount;
  discount: IPayPalSimpleAmount;
  insurance: IPayPalSimpleAmount;

  // All arguments for the constructor must be of type PayPalSimpleAmount
  constructor(
    item_total: IPayPalSimpleAmount,
    shipping: IPayPalSimpleAmount,
    handling: IPayPalSimpleAmount,
    tax_total: IPayPalSimpleAmount,
    shipping_discount: IPayPalSimpleAmount,
    discount: IPayPalSimpleAmount,
    insurance: IPayPalSimpleAmount
  ) {
    this.item_total = item_total;
    this.shipping = shipping;
    this.handling = handling;
    this.tax_total = tax_total;
    this.shipping_discount = shipping_discount;
    this.discount = discount;
    this.insurance = insurance;
  }
}

interface IPayPalSimpleAmount {
  currency_code: string;
  value: string;
}

class PayPalSimpleAmount {
  currency_code: string;
  value: string;
  constructor(currency_code: string, value: string) {
    this.currency_code = currency_code;
    this.value = value;
  }
}

interface IPayPalAmount {
  currency_code: string;
  value: string;
  breakdown: IPayPalBreakdown;
}

class PayPalAmount {
  currency_code: string;
  value: string;
  breakdown: IPayPalBreakdown;
  constructor(
    currency_code: string,
    value: string,
    breakdown: IPayPalBreakdown
  ) {
    this.currency_code = currency_code;
    this.value = value;
    this.breakdown = breakdown;
  }
}

interface IPayPalPayee {
  email_address: string;
  merchant_id: string;
}
class PayPalPayee {
  email_address: string;
  merchant_id: string;
  constructor(email_address: string, merchant_id: string) {
    this.email_address = email_address;
    this.merchant_id = merchant_id;
  }
}

interface IPayPalPurchaseUnit {
  invoice_id: string;
  description: string;
  amount: IPayPalAmount;
  payee: IPayPalPayee;
  items: IPayPalItem;
  shipping: IPayPalShipping;
}

class PayPalPurchaseUnit {
  invoice_id: string;
  description: string;
  amount: IPayPalAmount;
  payee: IPayPalPayee;
  items: IPayPalItem[];
  shipping: IPayPalShipping;

  constructor(
    invoice_id: string,
    description: string,
    amount: IPayPalAmount,
    payee: IPayPalPayee,
    items: IPayPalItem[],
    shipping: IPayPalShipping
  ) {
    this.invoice_id = invoice_id;
    this.description = description;
    this.amount = amount; // type PayPalAmount
    this.payee = payee; // type PayPalPayee
    this.items = items; // array of type PayPalItem
    this.shipping = shipping;
  }
}

interface IPayPalName {
  full_name: string;
}
class PayPalName {
  full_name: string;
  constructor(full_name: string) {
    this.full_name = full_name;
  }
}

interface IPayPalAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

class PayPalAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_2: string; // Town, City
  admin_area_1: string; // State (US), County, Province, Prefecture, Kanton
  postal_code: string;
  country_code: string;

  constructor(
    address_line_1: string,
    address_line_2: string,
    admin_area_2: string,
    admin_area_1: string,
    postal_code: string,
    country_code: string
  ) {
    this.address_line_1 = address_line_1;
    this.address_line_2 = address_line_2;
    this.admin_area_2 = admin_area_2; // A city, town, or village. Smaller than admin_area_level_1.
    /* admin_area_1
    The highest-level sub-division in a country, which is usually a province, state, or ISO-3166-2 
    subdivision. This data is formatted for postal delivery, for example, CA and not California. 
    Value, by country, is:
      UK. A county.
      US. A state.
      Canada. A province.
      Japan. A prefecture.
      Switzerland. A kanton.
    */
    this.admin_area_1 = admin_area_1;
    this.postal_code = postal_code;
    this.country_code = country_code; // alpha 2 ISO 3166-1 Code, e.g., US, FR, DE, GB
  }
}

interface IPayPalPhoneNumber {
  country_code: string;
  national_number: string;
}

class PayPalPhoneNumber {
  country_code: string;
  national_number: string;

  constructor(country_code: string, national_number: string) {
    this.country_code = country_code;
    this.national_number = national_number;
  }
}

interface IPayPalShipping {
  type: string;
  full_name: IPayPalName;
  email_address: string;
  phone_number: IPayPalPhoneNumber;
  address: IPayPalAddress;
}

class PayPalShipping {
  type: string;
  full_name: IPayPalName;
  email_address: string;
  phone_number: IPayPalPhoneNumber;
  address: IPayPalAddress;

  constructor(
    type: string,
    full_name: IPayPalName,
    email_address: string,
    phone_number: IPayPalPhoneNumber,
    address: IPayPalAddress
  ) {
    this.type = type;
    this.full_name = full_name;
    this.email_address = email_address;
    this.phone_number = phone_number;
    this.address = address;
  }
}

interface IPayPalExperienceContext {
  shipping_preference: string;
  return_url: string;
  cancel_url: string;
  brand_name: string;
  contact_preference: string;
  landing_page: string;
  user_action: string;
  payment_method_preference: string;
  address: IPayPalAddress; // Billing Address
}

class PayPalExperienceContext {
  // shipping_preference should either be "GET_FROM_FILE" (for shipped goods)
  // or "NO_SHIPPING" for digital sales.
  shipping_preference: string;
  return_url: string;
  cancel_url: string;
  brand_name: string;
  contact_preference: string;
  landing_page: string;
  user_action: string;
  payment_method_preference: string;
  address: IPayPalAddress;
  constructor(
    shipping_preference: string,
    return_url: string,
    cancel_url: string,
    billingAddress: IPayPalAddress
  ) {
    this.brand_name = KICK_START_RECORDS;
    this.shipping_preference = shipping_preference;
    this.contact_preference = NO_CONTACT_INFO;
    this.landing_page = NO_PREFERENCE;
    this.user_action = PAY_NOW;
    this.payment_method_preference = IMMEDIATE_PAYMENT_REQUIRED;
    this.return_url = return_url;
    this.cancel_url = cancel_url;
    this.address = billingAddress;
  }
}

interface IVenmoExperienceContext {
  shipping_preference: string;
}
class VenmoExperienceContext {
  shipping_preference: string;
  brand_name: string;
  constructor(shipping_preference: string) {
    this.brand_name = KICK_START_RECORDS;
    this.shipping_preference = shipping_preference;
  }
}

interface IPayPal {
  experience_context: IPayPalExperienceContext;
}

class PayPal {
  experience_context: IPayPalExperienceContext;
  constructor(experience_context: IPayPalExperienceContext) {
    this.experience_context = experience_context; // type PayPalExperienceContext
  }
}

interface IVenmo {
  experience_context: IVenmoExperienceContext;
}

class Venmo {
  experience_context: IVenmoExperienceContext;
  constructor(experience_context: IVenmoExperienceContext) {
    this.experience_context = experience_context; // type VenmoExperienceContext
  }
}

interface IPayPalPaymentSource {
  paypal: IPayPal;
  venmo: IVenmo;
}

class PayPalPaymentSource {
  paypal: IPayPal;
  venmo: IVenmo;
  constructor(paypal: IPayPal, venmo: IVenmo) {
    this.paypal = paypal; // type PayPal
    this.venmo = venmo; // type Venmo
  }
}

interface IPayPalOrder {
  purchase_units: IPayPalPurchaseUnit[];
  payment_source: IPayPalPaymentSource;
}

class PayPalOrder {
  purchase_units: IPayPalPurchaseUnit[];
  payment_source: IPayPalPaymentSource;
  intent: string;
  constructor(
    purchase_units: IPayPalPurchaseUnit[],
    payment_source: IPayPalPaymentSource
  ) {
    this.purchase_units = purchase_units;
    this.intent = CAPTURE; // only supporting CAPTURE for now.
    this.payment_source = payment_source; // type PayPalPaymentSource
  }
}

export {
  DIGITAL_GOODS,
  PHYSICAL_GOODS,
  DEFAULT_CURRENCY_CODE,
  GET_FROM_FILE,
  NO_SHIPPING,
  type IPayPal,
  PayPal,
  type IPayPalAmount,
  PayPalAmount,
  type IPayPalBreakdown,
  PayPalBreakdown,
  type IPayPalExperienceContext,
  PayPalExperienceContext,
  type IPayPalItem,
  PayPalItem,
  type IPayPalOrder,
  PayPalOrder,
  type IPayPalPayee,
  PayPalPayee,
  type IPayPalName,
  PayPalName,
  type IPayPalAddress,
  PayPalAddress,
  type IPayPalPhoneNumber,
  PayPalPhoneNumber,
  type IPayPalShipping,
  PayPalShipping,
  type IPayPalPaymentSource,
  PayPalPaymentSource,
  type IPayPalPurchaseUnit,
  PayPalPurchaseUnit,
  type IPayPalSimpleAmount,
  PayPalSimpleAmount,
  type IPayPalUPC,
  PayPalUPC,
  type IVenmo,
  Venmo,
  type IVenmoExperienceContext,
  VenmoExperienceContext,
};
