import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mokesell.sgp1.cdn.digitaloceanspaces.com",
        port: "",
        search: "",
        pathname: "/listings/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
