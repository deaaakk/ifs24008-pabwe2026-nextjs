/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true, // Meng-inline CSS kritis dan menunda CSS yang belum diperlukan
  },
};

module.exports = nextConfig;