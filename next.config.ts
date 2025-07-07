import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    scrollRestoration: false,
  },
};

export default nextConfig;
