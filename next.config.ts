import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.equalexperts.com",
      },
      {
        protocol: "https",
        hostname: "equalexperts.github.io",
      },
    ],
  },

};

export default nextConfig;
