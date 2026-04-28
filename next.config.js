/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      unoptimized: true,
    },
    // تأكد من حذف أي إشارة لـ experimental: { serverActions: true } 
    // وحذف swcMinify تماماً
  };
  
  module.exports = nextConfig;