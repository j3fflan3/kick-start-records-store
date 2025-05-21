"use client";

import { useEffect, useMemo, useState } from "react";
import { serverGetUSPSRates } from "../_library/serverActions";
import { BaseRatesRequest } from "../_library/usps";

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
    async function getBaseRates(sBaseRatesRequest, count) {
      const data = await serverGetUSPSRates(sBaseRatesRequest, count);
      if (data && data?.message) {
        setShippingError(data.message);
        setShippingCost(0);
        return;
      }
      const { handling, totalBasePrice } = data;
      const shippingAndHandling = Number(handling) + Number(totalBasePrice);
      const roundedShippingAndHandling = shippingAndHandling.toFixed(2);
      setShippingError("");
      setShippingCost(parseFloat(roundedShippingAndHandling));
    }
    const sBaseRatesRequest = JSON.stringify(request);
    getBaseRates(sBaseRatesRequest, itemCount);
  }, [request, itemCount]);

  return { shippingCost, shippingError };
}

export { useShippingCalculator };
