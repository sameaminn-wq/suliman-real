/** @type {import('next').NextConfig} */
const nextConfig = {
  // ملاحظة: في النسخ الأحدث، Server Actions مفعلة تلقائياً
  // إذا كانت نسختك تدعمها كخيار تجريبي، نتركها هكذا لكن بدون boolean إذا لزم الأمر
  experimental: {
    // تم تركها كما هي، وإذا استمر الخطأ يفضل إزالة هذا القسم بالكامل
    serverActions: true, 
  },

  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  reactStrictMode: false,
  // تم إزالة swcMinify لأنه مفعل تلقائياً وتسبب في تحذير سابق
};

module.exports = nextConfig;