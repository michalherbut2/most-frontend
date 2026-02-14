import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['most.salezjanie.pl'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'most.salezjanie.pl',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
