import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static prerendering for all pages that use auth/supabase
  // They will be rendered on-demand instead
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
