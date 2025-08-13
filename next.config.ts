import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // هر ایمپورت از server رو نادیده بگیر
    config.resolve.alias['server'] = false;
    return config;
  },
};

export default nextConfig;
