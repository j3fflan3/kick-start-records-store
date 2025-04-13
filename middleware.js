import { updateSession } from "@/src/app/_library/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/profile/:path*"],
};
