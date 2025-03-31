import { dbVerifySignUp } from "@/app/_library/serverActions";
import { Base64UrlDecoder } from "next-base64-encoder";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  if (token_hash && type) {
    const error = await dbVerifySignUp({ type, token_hash });
    if (error) {
      console.log(error.message);
      const byteMessage = new TextEncoder().encode(error.message);
      const base64UrlDecoder = new Base64UrlDecoder();
      const base64Message = base64UrlDecoder.decode(byteMessage);
      redirect(`/auth/auth-code-error?message=${base64Message}`);
    } else {
      redirect("/?signup_success=true");
    }
  }
  redirect("/auth/auth-code-error");
}
