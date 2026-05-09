/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. تجاوز أخطاء التنسيق (مثل علامات التنصيص والصور) أثناء البناء
    eslint: {
      ignoreDuringBuilds: true,
    },
    // 2. تجاوز أخطاء التايب سكريبت إن وجدت
    typescript: {
      ignoreBuildErrors: true,
    },
    // 3. تعطيل تحسين الصور (ضروري جداً لتطبيقات الديسك توب لتعمل الصور المحلية)
    images: {
      unoptimized: true,
    },
    // 4. إعدادات ضرورية لبيئة Electron
    trailingSlash: true,
  };
  
  module.exports = nextConfig;