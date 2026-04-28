// app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOutAction() {
  // ✅ بدون await
  const supabase = createClient()

  // تسجيل الخروج من Supabase
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
    redirect('/dashboard?error=logout-failed')
  }

  // تحديث الكاش بعد الخروج
  revalidatePath('/', 'layout')

  // تحويل المستخدم لصفحة الدخول
  redirect('/same-2090')
}