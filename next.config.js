/** @type {import('next').NextConfig} */
const nextConfig = {
  // تفعيل Server Actions بشكل صريح لتجاوز خطأ الـ Build
  experimental: {
    serverActions: true,
  },
  // إعدادات الصور لضمان عدم انهيار الموقع عند العرض
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', 
      },
    ],
  },
};

module.exports = nextConfig;