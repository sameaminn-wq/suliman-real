import { createBrowserClient } from '@supabase/ssr';

/**
 * جلب القيم من متغيرات البيئة.
 * ملاحظة: استخدام createBrowserClient من حزمة @supabase/ssr 
 * هو المفتاح لربط الجلسة بين المتصفح والـ Middleware عبر الكوكيز.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// وظيفة تنظيف الرابط (تحسين أمني واحترافي كما فعلت أنت)
const cleanUrl = (url: string) => {
  if (!url) return '';
  return url.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
};

const sanitizedUrl = cleanUrl(supabaseUrl);

if (!sanitizedUrl || !supabaseAnonKey) {
  console.warn('⚠️ تحذير: مفاتيح Supabase مفقودة!');
}

/**
 * إنشاء العميل باستخدام Browser Client.
 * هذا العميل سيتعامل تلقائياً مع الكوكيز التي يرسلها الـ Middleware.
 */
export const supabase = createBrowserClient(
  sanitizedUrl,
  supabaseAnonKey
);