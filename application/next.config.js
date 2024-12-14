/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compress: true,
  images: {
    minimumCacheTTL: 60,
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
