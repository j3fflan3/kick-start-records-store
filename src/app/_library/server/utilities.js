"use server";
import { revalidatePath } from "next/cache";

const getURL = () => {
  // NOTE: environment URLs other than localhost should have no protocol, e.g., my-site.vercel.app
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.VERCEL_URL ?? // Automatically set by VERCEL.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

function revalidatePathForClient(path) {
  revalidatePath(path);
}

export { getURL, revalidatePathForClient };
