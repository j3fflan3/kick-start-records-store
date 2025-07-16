type AddressType = "Shipping" | "Billing" | "Both";

// Interface and Class for Address(es)
interface IOrderAddress {
  addressType: AddressType;
  addressLine1: string;
  addressLine2: string;
  cityTownVillage: string;
  stateProvinceCounty: string;
  postalCode: string;
  countryCode: string;
}

interface IAddress {
  firstName?: string | undefined;
  lastName?: string | undefined;
  address: string;
  addressContinued?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  destinationCountryCode: string;
}

interface IUserAddress {
  firstName: string;
  lastName: string;
  billingSameAsShipping: boolean;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
}

class Address implements IAddress {
  firstName?: string | undefined;
  lastName?: string | undefined;
  address: string;
  addressContinued?: string | undefined;
  city: string;
  stateProvince: string;
  postalCode: string;
  destinationCountryCode: string;
  constructor(
    address: string,
    city: string,
    stateProvince: string,
    postalCode: string,
    destinationCountryCode: string,
    addressContinued?: string | undefined,
    firstName?: string | undefined,
    lastName?: string | undefined
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.addressContinued = addressContinued;
    this.city = city;
    this.stateProvince = stateProvince;
    this.postalCode = postalCode;
    this.destinationCountryCode = destinationCountryCode;
  }
}

class UserAddress implements IUserAddress {
  firstName: string;
  lastName: string;
  billingSameAsShipping: boolean;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  constructor(
    first: string,
    last: string,
    billingSame: boolean,
    shipping: IAddress,
    billing?: IAddress
  ) {
    this.firstName = first;
    this.lastName = last;
    this.billingSameAsShipping = billingSame;
    this.shippingAddress = shipping;
    this.billingAddress = billing;
  }
}

class OrderAddress implements IOrderAddress {
  addressType: AddressType;
  addressLine1: string;
  addressLine2: string;
  cityTownVillage: string;
  stateProvinceCounty: string;
  postalCode: string;
  countryCode: string;
  constructor(
    addressType: AddressType,
    addressLine1: string,
    addressLine2: string,
    cityTownVillage: string,
    stateProvinceCounty: string,
    postalCode: string,
    countryCode: string
  ) {
    this.addressType = addressType;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.cityTownVillage = cityTownVillage;
    this.stateProvinceCounty = stateProvinceCounty;
    this.postalCode = postalCode;
    this.countryCode = countryCode;
  }
}
export {
  Address,
  UserAddress,
  OrderAddress,
  type IAddress,
  type IUserAddress,
  type IOrderAddress,
  type AddressType,
};
