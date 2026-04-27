/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. إعدادات الصور (ضرورية جداً لعمل الموقع دون انهيار)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // لدعم صور منصة سوبابيس الخاصة بك
      },
    ],
  },

  // 2. تفعيل Server Actions (فقط إذا كانت نسختك أقدم من 14)
  // إذا كنت على الإصدار 14 أو 15، يمكنك حذف هذا القسم تماماً
  /*
  experimental: {
    serverActions: true,
  },
  */
  
  // 3. تحسينات الإنتاج (اختياري)
  typescript: {
    // تجاهل أخطاء التايب سكريبت عند الـ Build إذا كنت مستعجلاً (لا ينصح به دائماً)
    ignoreBuildErrors: false, 
  },
};

module.exports = nextConfig;