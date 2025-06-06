"use client";

import { useEffect, useMemo, useState } from "react";
import { serverGetUSPSRates } from "../_library/serverActions";
import {
  InternalationRatesRequest,
  USBaseRatesRequest,
} from "../_library/usps";

function useShippingCalculator({
  itemCount,
  weight,
  destinationZIPCode = "",
  foreignPostalCode = "",
  destinationCountryCode = "",
}) {
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingError, setShippingError] = useState("");

  const request = useMemo(() => {
    return foreignPostalCode
      ? new InternalationRatesRequest(
          "92339",
          foreignPostalCode,
          destinationCountryCode,
          weight
        )
      : new USBaseRatesRequest("92339", destinationZIPCode, weight);
  }, [destinationCountryCode, destinationZIPCode, foreignPostalCode, weight]);

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
      setShippingCost(Math.round(parseFloat(roundedShippingAndHandling) * 100)); // This needs to be in cents!
    }
    // if the user hasn't stored a zipcode, they'll need to enter one on the
    // checkout/payment page.

    if (!destinationZIPCode && !foreignPostalCode) return;
    if (destinationZIPCode && destinationZIPCode < 5) return;
    const sBaseRatesRequest = JSON.stringify(request);
    console.log(
      `useShippingCalculator -> sBaseRatesRequest: ${sBaseRatesRequest}`
    );
    getBaseRates(sBaseRatesRequest, itemCount);
  }, [
    request,
    itemCount,
    destinationCountryCode,
    foreignPostalCode,
    destinationZIPCode,
  ]);

  return { shippingCost, shippingError };
}

export { useShippingCalculator };
