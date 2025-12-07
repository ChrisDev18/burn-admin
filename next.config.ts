import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://api.burnfm.com/**"), new URL('https://acyngiqumcx5ahy3.public.blob.vercel-storage.com/**')],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
