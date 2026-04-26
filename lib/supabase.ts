import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// التحقق من وجود المتغيرات قبل تشغيل العميل
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ خطأ أمني وتقني: بيانات Supabase غير موجودة في ملفات البيئة.");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);