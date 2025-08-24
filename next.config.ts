import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // ビルド時に ESLint を無視
  ignoreDuringBuilds: true,
};

export default nextConfig;
