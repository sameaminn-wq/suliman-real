/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل Server Actions
  experimental: {
    serverActions: true,
  },

  // إعدادات الصور المحسنة لبيئة StackBlitz
  images: {
    unoptimized: true, // أضفت هذا السطر لحل مشكلة الـ 404 التي ظهرت لك
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // تحسينات الاستقرار
  reactStrictMode: false, // تعطيله يقلل الضغط على الذاكرة في المتصwفح
  swcMinify: true,
};

module.exports = nextConfig;