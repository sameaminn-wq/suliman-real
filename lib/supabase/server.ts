import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // نستخدم getAll بدلاً من get الفردية للتوافق مع المعايير الجديدة
        getAll() {
          return cookieStore.getAll()
        },
        // نستخدم setAll لضمان تمرير كافة الكوكيز دفعة واحدة للسيرفر
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // تجاهل الخطأ: يحدث هذا عندما يتم استدعاء الدالة من Server Component
            // حيث لا يمكن تعديل الكوكيز بعد بدء إرسال الاستجابة
          }
        },
      },
    }
  )
}