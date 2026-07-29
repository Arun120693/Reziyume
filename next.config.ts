import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep turbopack happy (Next.js 16 default)
  turbopack: {},
  // pdf-parse uses Node.js APIs — run it only on the server
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;


