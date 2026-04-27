/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. تفعيل Server Actions (ضروري جداً لتجنب خطأ الـ Build في بيئات السحاب)
  experimental: {
    serverActions: true,
  },

  // 2. إعدادات الصور (صيغة احترافية وشاملة)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // يسمح بجميع الصور من أي مصدر خارجي (حل مرن لـ StackBlitz)
      },
    ],
  },

  // 3. تحسينات إضافية لاستقرار StackBlitz
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;قع