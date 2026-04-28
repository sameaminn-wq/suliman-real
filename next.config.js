/** @type {import('next').NextConfig} */
const nextConfig = {
  // ملاحظة: تم إزالة serverActions لأنها أصبحت مفعلة تلقائياً في الإصدارات الحديثة
  // ومحاولة تفعيلها يدوياً بقيمة true تسبب الخطأ الذي ظهر لك.

  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // تحسينات الاستقرار لبيئة StackBlitz
  reactStrictMode: false, 

  /* تم إزالة swcMinify لأنه أصبح الخيار الافتراضي والوحيد في الإصدارات الجديدة
     ووجوده كخيار يدوي يسبب تحذير "Unrecognized key". */
};

module.exports = nextConfig;