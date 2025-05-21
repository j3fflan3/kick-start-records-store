"use client";

import { useEffect, useMemo, useState } from "react";
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

  const request = useMemo(
    () =>
      new BaseRatesRequest(
        originZIPCode,
        destinationZIPCode,
        foreignPostalCode,
        destinationCountryCode,
        weight
      ),
    [
      destinationCountryCode,
      destinationZIPCode,
      foreignPostalCode,
      originZIPCode,
      weight,
    ]
  );
  useEffect(() => {
    async function getBaseRates(sJson, count) {
      const data = await serverGetUSPSRates(sJson, count);
      if (data && data?.message) {
        setShippingError(data.message);
        setShippingCost(0);
        return;
      }
      setShippingError("");
      let shippingAndHandling =
        Number(data.handling) + Number(data.totalBasePrice);
      let rounded = shippingAndHandling.toFixed(2);
      setShippingCost(parseFloat(rounded));
    }
    const sJson = JSON.stringify(request);
    getBaseRates(sJson, itemCount);
  }, [request, itemCount]);

  return { shippingCost, shippingError };
}

export { useShippingCalculator };
