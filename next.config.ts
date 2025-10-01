import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** next configs */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ".prisma/client/index-browser": false,
    };
    return config;
  },
};

export default nextConfig;
