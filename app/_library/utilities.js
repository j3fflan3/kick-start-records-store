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

const subtotal = (arrToReduce) => {
  const subtotal = arrToReduce.reduce(
    (sum, item) => sum + item.count * item.price,
    0
  );
  return formatDecimal(subtotal / 100);
};
export { printRecordFormat, formatDecimal, subtotal };
