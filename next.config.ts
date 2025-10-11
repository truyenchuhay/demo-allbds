import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    
    ACCOUNT_ID: process.env.ACCOUNT_ID,
    ACCESS_KEY_R2: process.env.ACCESS_KEY_R2,
    SECRET_KEY_R2: process.env.SECRET_KEY_R2,
    BUCKET_STATIC: process.env.BUCKET_STATIC,
  }
};

export default nextConfig;
