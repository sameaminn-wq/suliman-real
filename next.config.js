/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true, // هذا السطر هو الحل للمشكلة
    },
    // أي إعدادات أخرى لديك اتركها كما هي
  };
  
  module.exports = nextConfig;