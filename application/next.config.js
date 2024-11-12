/** @type {import('next').NextConfig} */
// This tells TypeScript what type of configuration object we're creating

const nextConfig = {
  // Enable standalone output for optimized Docker builds
  output: "standalone",

  // Configure allowed image sources for Next.js Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "80",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
