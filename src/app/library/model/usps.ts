class USBaseRatesRequest {
  originZIPCode: string;
  destinationZIPCode: string;
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  mailClass: string | undefined;
  processingCategory: string | undefined;
  rateIndicator: string | null;
  destinationEntryFacilityType: string | null;
  priceType: string | null;
  mailingDate: string | null;
  accountType: string | null;
  accountNumber: string | null;

  constructor(
    originZIPCode: string,
    destinationZIPCode: string,
    weight: number,
    length: number | null = null,
    width: number | null = null,
    height: number | null = null,
    mailClass: string | undefined = process.env.USPS_MAIL_CLASS,
    processingCategory: string | undefined = process.env.USPS_PROCESSING_CATEGORY,
    rateIndicator: string | null = null,
    destinationEntryFacilityType: string | null = null,
    priceType: string | null = null,
    mailingDate: string | null = null,
    accountType: string | null = null,
    accountNumber: string | null = null
  ) {
    this.originZIPCode = originZIPCode;
    this.destinationZIPCode = destinationZIPCode;
    this.weight = weight;
    this.length = length;
    this.width = width;
    this.height = height;
    this.mailClass = mailClass;
    this.processingCategory = processingCategory;
    this.rateIndicator = rateIndicator;
    this.destinationEntryFacilityType = destinationEntryFacilityType;
    this.priceType = priceType;
    this.mailingDate = mailingDate;
    this.accountType = accountType;
    this.accountNumber = accountNumber;
  }
}

class InternalationRatesRequest {
  originZIPCode: string;
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  mailClass: string | undefined;
  processingCategory: string | undefined;
  rateIndicator: string | null;
  destinationEntryFacilityType: string;
  foreignPostalCode: string;
  destinationCountryCode: string;
  priceType: string | null;
  mailingDate: string | null;
  accountType: string | null;
  accountNumber: string | null;

  constructor(
    originZIPCode: string,
    foreignPostalCode: string,
    destinationCountryCode: string,
    weight: number,
    length: number | null = null,
    width: number | null = null,
    height: number | null = null,
    mailClass: string | undefined = process.env.USPS_MAIL_CLASS_INTL,
    processingCategory: string | undefined = process.env.USPS_PROCESSING_CATEGORY,
    rateIndicator: string | null = null,
    priceType: string | null = null,
    mailingDate: string | null = null,
    accountType: string | null = null,
    accountNumber: string | null = null
  ) {
    this.originZIPCode = originZIPCode;
    this.weight = weight;
    this.length = length;
    this.width = width;
    this.height = height;
    this.mailClass = mailClass;
    this.processingCategory = processingCategory;
    this.rateIndicator = rateIndicator;
    this.destinationEntryFacilityType = "INTERNATIONAL_SERVICE_CENTER";
    this.foreignPostalCode = foreignPostalCode;
    this.destinationCountryCode = destinationCountryCode;
    this.priceType = priceType;
    this.mailingDate = mailingDate;
    this.accountType = accountType;
    this.accountNumber = accountNumber;
  }
}

class USPSOAuth2Request {
  grant_type: string;
  client_id: string | undefined;
  client_secret: string | undefined;
  scope: string;

  constructor(
    grantType: string,
    clientId: string | undefined,
    clientSecret: string | undefined,
    scope: string
  ) {
    this.grant_type = grantType;
    this.client_id = clientId;
    this.client_secret = clientSecret;
    this.scope = scope;
  }
}

export { USBaseRatesRequest, InternalationRatesRequest, USPSOAuth2Request };
