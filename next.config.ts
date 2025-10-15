import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    URL_FILE_STATIC: process.env.URL_FILE_STATIC
  }
};

export default nextConfig;
