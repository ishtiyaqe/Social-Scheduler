/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.0.185', '127.0.0.1'],
  images: {
    domains: ["localhost"], // not strictly needed, but safe
  },
};

export default nextConfig;
