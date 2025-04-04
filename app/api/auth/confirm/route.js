import { dbVerifyOtp } from "@/app/_library/serverActions";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  if (token_hash && type) {
    console.log("verifying Otp");
    const { error } = dbVerifyOtp(type, token_hash);
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }
  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
