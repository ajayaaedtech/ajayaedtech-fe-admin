import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  generateEtags: false,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value:
              "noindex, nofollow, noarchive, nosnippet, notranslate, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
