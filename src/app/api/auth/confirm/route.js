import { createClient } from "@/src/app/_library/supabase/server";
import { Base64Decoder, Base64Encoder } from "next-base64-encoder";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    } else {
      console.log(error.message);
      const byteMessage = new TextEncoder().encode(error.message);
      const base64UrlDecoder = new Base64Decoder();
      const base64Phrase = base64UrlDecoder.decode(byteMessage);
      redirectTo.pathname = "/auth/auth-code-error";
      redirectTo.searchParams.set("message", base64Phrase);
      redirectTo.searchParams.set("next", next);
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
