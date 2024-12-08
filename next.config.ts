import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com"
      }
    ]
  }
};

export default nextConfig;
