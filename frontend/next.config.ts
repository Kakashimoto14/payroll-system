import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress turbopack workspace root warning (multiple lockfiles detected)
  turbopack: {
    root: import.meta.dirname,
  },
  // API proxy rewrites — frontend calls /api/* → backend localhost:4000/api/*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
