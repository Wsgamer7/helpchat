/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "techcommunity.microsoft.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
