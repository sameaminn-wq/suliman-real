import { createClient } from '@supabase/supabase-js';

// جلب القيم من متغيرات البيئة لضمان الأمان
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * وظيفة تنظيف الرابط:
 * تضمن هذه الوظيفة إزالة أي مسارات زائدة مثل /rest/v1 قد تكون أضيفت بالخطأ 
 * في إعدادات البيئة، لأن مكتبة Supabase تضيفها تلقائياً.
 */
const cleanUrl = (url: string) => {
  if (!url) return '';
  // إزالة أي مائل في النهاية وإزالة مسارات الـ API المكررة إن وجدت
  return url.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
};

const sanitizedUrl = cleanUrl(supabaseUrl);

// التحقق من وجود القيم قبل إنشاء العميل لمنع انهيار التطبيق
if (!sanitizedUrl || !supabaseAnonKey) {
  console.warn(
    'تحذير أمني: مفاتيح Supabase غير مكتملة في ملف الـ .env - سيتم تعطيل ميزات قاعدة البيانات.'
  );
}

/**
 * إنشاء عميل Supabase الموحد
 * يتم استخدامه في جميع أنحاء التطبيق للتعامل مع قاعدة البيانات والتوثيق
 */
export const supabase = createClient(sanitizedUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // الحفاظ على جلسة تسجيل الدخول
    autoRefreshToken: true, // تحديث التوكن تلقائياً
    detectSessionInUrl: true, // كشف الجلسة من الرابط (مهم لتغيير كلمة السر والدخول السريع)
  },
});