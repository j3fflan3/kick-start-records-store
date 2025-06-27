import { U } from "@upstash/redis/zmscore-CjoCv9kz";

// Interface and Class for Address(es)
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

export { Address, UserAddress, type IAddress, type IUserAddress };
