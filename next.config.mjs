/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vnshanftypzvajpbbwxr.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
  // If you uncomment this line, during build, NextJS will
  // generate a static site under "output" assuming you have
  // no dynamic pages:
  // output: "export",
};

export default nextConfig;
