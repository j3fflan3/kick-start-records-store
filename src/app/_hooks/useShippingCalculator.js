"use client";

import { useEffect, useMemo, useState } from "react";
import { serverGetUSPSRates } from "../_library/serverActions";
import {
  InternalationRatesRequest,
  USBaseRatesRequest,
} from "../_library/usps";
import { formatDollars } from "../_library/utilities";

function useShippingCalculator({
  itemCount,
  weight,
  postalCode = "",
  destinationCountryCode = "US",
}) {
  const [shippingCost, setShippingCost] = useState("0.00");
  const [shippingCostCents, setShippingCostCents] = useState(0);
  const [shippingError, setShippingError] = useState("");

  const request = useMemo(() => {
    return destinationCountryCode !== "US"
      ? new InternalationRatesRequest(
          "92339",
          postalCode, // foreignPostalCode
          destinationCountryCode,
          weight
        )
      : new USBaseRatesRequest("92339", postalCode, weight);
  }, [destinationCountryCode, postalCode, weight]);

  useEffect(() => {
    async function getBaseRates(sBaseRatesRequest, count) {
      const data = await serverGetUSPSRates(sBaseRatesRequest, count);
      if (data && data?.message) {
        setShippingError(data.message);
        setShippingCost("0.00");
        return;
      }
      const { handling, totalBasePrice } = data;
      const shippingAndHandling = Number(handling) + Number(totalBasePrice);
      setShippingError("");
      setShippingCostCents(shippingAndHandling * 100); // this needs to be in cents
      console.log(`shippingAndHandling = ${shippingAndHandling}`);

      setShippingCost(shippingAndHandling.toFixed(2)); // String formatted for PayPal
    }
    // if the user hasn't stored a zipcode, they'll need to enter one on the
    // checkout/payment page.

    if (!postalCode || (postalCode && postalCode < 5)) return;
    const sBaseRatesRequest = JSON.stringify(request);
    console.log(
      `useShippingCalculator -> sBaseRatesRequest: ${sBaseRatesRequest}`
    );
    getBaseRates(sBaseRatesRequest, itemCount);
  }, [request, itemCount, destinationCountryCode, postalCode]);

  return { shippingCost, shippingCostCents, shippingError };
}

export { useShippingCalculator };
