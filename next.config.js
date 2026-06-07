/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  serverExternalPackages: ['pdf-parse', 'pdf2json'],
};

export default nextConfig;
