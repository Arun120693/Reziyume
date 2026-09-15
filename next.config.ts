import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // OAuth cookies must be created on the same host as Google's callback.
    if (!process.env.VERCEL || !process.env.NEXTAUTH_URL) return [];
    const authUrl = new URL(process.env.NEXTAUTH_URL);
    const canonicalHost = authUrl.hostname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return ["/login", "/register"].map((source) => ({
      source,
      destination: `${authUrl.origin}${source}`,
      missing: [{ type: "host" as const, value: canonicalHost }],
      permanent: false,
    }));
  },

  // Keep turbopack happy (Next.js 16 default)
  turbopack: {},

  // pdf-parse uses Node.js APIs — run it only on the server
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas", "pdfjs-dist"],
};

export default nextConfig;