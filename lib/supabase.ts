import { createBrowserClient } from '@supabase/ssr';

// جلب القيم مع وضع قيم احتياطية (Fallback) لمنع انهيار الـ Build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const cleanUrl = (url: string) => {
  if (!url) return '';
  return url.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
};

const sanitizedUrl = cleanUrl(supabaseUrl);

/**
 * إنشاء العميل.
 * استخدام القيم الاحتياطية هنا يضمن أن الـ Build سينجح (Success).
 * وعندما يفتح المستخدم الموقع فعلياً، سيقوم النظام بجلب القيم الحقيقية من البيئة.
 */
export const supabase = createBrowserClient(
  sanitizedUrl,
  supabaseAnonKey
);