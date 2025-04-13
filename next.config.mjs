/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vnshanftypzvajpbbwxr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/images/**",
      },
      {
        protocol: "https",
        hostname: "lqmompvxohaqxpbrihug.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.68.54"],
  // If you uncomment this line, during build, NextJS will
  // generate a static site under "output" assuming you have
  // no dynamic pages:
  // output: "export",
};

export default nextConfig;
