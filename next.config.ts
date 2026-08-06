import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    outputFileTracingIncludes: {
      '/api/*': ['./db/custom.db'],
    },
  },
};

export default nextConfig;
