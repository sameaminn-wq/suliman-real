import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * وظيفة إنشاء كلاينت Supabase للعمل على السيرفر (Server-side)
 * تقوم بربط الجلسة آلياً مع المتصفح عبر الكوكيز
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // قراءة الكوكي من المتصفح
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // تعيين كوكي جديدة (مثل توكن الجلسة)
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // تجاهل الخطأ إذا تم استدعاؤه من مكون خادم (Server Component)
          }
        },
        // حذف الكوكي (عند تسجيل الخروج)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // تجاهل الخطأ
          }
        },
      },
    }
  )
}