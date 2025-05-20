"use client";

import { useEffect, useState } from "react";
import { BaseRatesRequest } from "../_library/usps";
import { getDateForUSPS } from "../_library/utilities";
import { serverGetUSPSRates } from "../_library/serverActions";

function useShippingCalculator(
  itemCount,
  weight,
  originZIPCode,
  destinationZIPCode,
  foreignPostalCode = "",
  destinationCountryCode = ""
) {
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingError, setShippingError] = useState("");
  let length = 0;
  let width = 0;
  let height = 0;
  let rateIndicator = itemCount < 4 ? "SP" : "LE";
  if (itemCount < 4) {
    length = 8;
    width = 7.25;
  } else if (itemCount > 3 && itemCount < 13) {
    length = 6;
    width = 5;
    height = 5;
  } else {
    length = 11;
    width = 11;
    height = 5;
  }

  useEffect(() => {
    async function getBaseRates(req) {
      const data = await serverGetUSPSRates(request, itemCount);
      if (data && data?.message) {
        setShippingError(data.message);
        setShippingCost(0);
        return;
      }
      setShippingError("");
      setShippingCost(data.handling + data.totalBasePrice);
    }
    const request = new BaseRatesRequest(
      originZIPCode,
      destinationZIPCode,
      weight,
      length,
      width,
      height,
      "MEDIA_MAIL",
      "MACHINABLE",
      rateIndicator,
      "NONE",
      "RETAIL",
      getDateForUSPS(),
      foreignPostalCode,
      destinationCountryCode
    );
    getBaseRates(request, itemCount);
  }, [
    itemCount,
    originZIPCode,
    destinationZIPCode,
    destinationCountryCode,
    foreignPostalCode,
    length,
    weight,
    width,
    height,
    rateIndicator,
  ]);

  return { shippingCost, shippingError };
}

export { useShippingCalculator };
