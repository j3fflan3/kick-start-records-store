import { getRedis } from "@/src/app/_library/server/redis";
import {
  oAuthUSPSRequest,
  getUSPS_ACCESS_TOKEN,
} from "@/src/app/_library/server/usps";
import { NextRequest, NextResponse } from "next/server";

const redis = await getRedis();

export async function GET(request: NextRequest) {
  const trackingNumber =
    request.nextUrl.searchParams.get("tracking_number") ?? "";
  await oAuthUSPSRequest();
  // verify someone hasn't attempted to forge a request
  const matchesTrackingNumberPattern =
    /^[0-9]+$/.test(trackingNumber) && trackingNumber.length > 0;
  if (!matchesTrackingNumberPattern) {
    return NextResponse.json({
      error: `Invalid Tracking Number ${trackingNumber}`,
      status: 400,
    });
  }
  const endpoint = `${process.env.USPS_API_URL}/tracking/v3/tracking/${trackingNumber}`;
  try {
    const token = await getUSPS_ACCESS_TOKEN();
    const access_token = await redis.get(token);
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!response.ok) {
      const { error } = await response.json();
      console.log(error);
      throw new Error(`${error.code} - ${error.message}`);
    }
    const data = await response.json();
    console.log(`tracking response: ${JSON.stringify(data, null, 2)}`);
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(`PayPal error: ${error}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
