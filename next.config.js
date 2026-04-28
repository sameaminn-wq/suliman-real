/** @type {import('next').NextConfig} */
const nextConfig = {
  // ملاحظة: serverActions و swcMinify مفعلة تلقائياً في إصدار 16 ولا داعي لكتابتها
  
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // يفضل لاحقاً تحديد دومين Supabase لزيادة الأمان
      },
    ],
  },

  reactStrictMode: false, 
};

module.exports = nextConfig;