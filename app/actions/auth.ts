// app/actions/auth.ts
'use server' // ضروري جداً لضمان تنفيذ الكود على السيرفر فقط

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOutAction() {
  const supabase = await createClient()

  // 1. تسجيل الخروج من سوبابيس (يمسح الجلسة في السيرفر)
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
    // لا نعيد توجيه المستخدم لصفحة خطأ تقنية، بل نعيده للرئيسية مع فشل العملية
    redirect('/dashboard?error=logout-failed')
  }

  // 2. تحديث الكاش لضمان عدم ظهور بيانات قديمة بعد الخروج
  revalidatePath('/', 'layout')

  // 3. إعادة التوجيه لصفحة تسجيل الدخول (حسب المسار في مشروعك)
  redirect('/same-2090') 
}