import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "cdn.bsky.app",
    }],
  },
  /* config options here */
};

export default nextConfig;
