export async function clientGetUSPSTracking(trackingNumber: string): Promise<unknown> {
  console.log(`tracking number: ${trackingNumber}`);
  try {
    const response = await fetch(
      `/api/usps/tracking?tracking_number=${trackingNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const result = await response.json();
    // api response: {data:{...}, error:{...}, status:"n"}
    return result;
  } catch (err) {
    console.log(`USPS tracking error: ${(err as Error).message}`);
    throw err;
  }
}
