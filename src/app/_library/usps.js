class USBaseRatesRequest {
  constructor(
    originZIPCode,
    destinationZIPCode,
    weight,
    length = null,
    width = null,
    height = null,
    mailClass = process.env.USPS_MAIL_CLASS,
    processingCategory = process.env.USPS_PROCESSING_CATEGORY,
    rateIndicator = null,
    destinationEntryFacilityType = null,
    priceType = null,
    mailingDate = null,
    accountType = null,
    accountNumber = null
  ) {
    this.originZIPCode = originZIPCode;
    this.destinationZIPCode = destinationZIPCode; // leave blank for international
    this.weight = weight; // float
    this.length = length; // float
    this.width = width; // float
    this.height = height; // float
    this.mailClass = mailClass; // MEDIA MAIL, USPS_GROUND_ADVANTAGE
    this.processingCategory = processingCategory; // FLATS, MACHINABLE, NONSTANDARD
    this.rateIndicator = rateIndicator; // SP (Single Piece), LE (Single-piece parcel)
    this.destinationEntryFacilityType = destinationEntryFacilityType; // NONE or INTERNATIONAL_SERVICE_CENTER
    this.priceType = priceType;
    this.mailingDate = mailingDate;
    this.accountType = accountType;
    this.accountNumber = accountNumber;
  }
}

class InternalationRatesRequest {
  constructor(
    originZIPCode,
    foreignPostalCode,
    destinationCountryCode,
    weight,
    length = null,
    width = null,
    height = null,
    mailClass = process.env.USPS_MAIL_CLASS_INTL,
    processingCategory = process.env.USPS_PROCESSING_CATEGORY,
    rateIndicator = null,
    priceType = null,
    mailingDate = null,
    accountType = null,
    accountNumber = null
  ) {
    this.originZIPCode = originZIPCode;
    this.weight = weight; // float
    this.length = length; // float
    this.width = width; // float
    this.height = height; // float
    this.mailClass = mailClass; // MEDIA MAIL, USPS_GROUND_ADVANTAGE
    this.processingCategory = processingCategory; // FLATS, MACHINABLE, NONSTANDARD
    this.rateIndicator = rateIndicator; // SP (Single Piece), LE (Single-piece parcel)
    this.destinationEntryFacilityType = "INTERNATIONAL_SERVICE_CENTER"; // NONE or INTERNATIONAL_SERVICE_CENTER
    this.foreignPostalCode = foreignPostalCode;
    this.destinationCountryCode = destinationCountryCode;
    this.priceType = priceType;
    this.mailingDate = mailingDate;
    this.accountType = accountType;
    this.accountNumber = accountNumber;
  }
}

class USPSOAuth2Request {
  constructor(grantType, clientId, clientSecret, scope) {
    this.grant_type = grantType;
    this.client_id = clientId;
    this.client_secret = clientSecret;
    this.scope = scope;
  }
}

export { USBaseRatesRequest, InternalationRatesRequest, USPSOAuth2Request };
