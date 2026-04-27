'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addStaffAction(formData: { email: string, full_name: string, role: string }) {
  
  // 1. الأمان: التحقق من أن المستدعي هو "أدمن"
  const userClient = createServerClient()
  const { data: { user }, error: userError } = await userClient.auth.getUser()
  
  if (userError || !user) return { success: false, error: "يجب تسجيل الدخول" }

  const { data: adminCheck } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminCheck?.role !== 'admin') {
    return { success: false, error: "صلاحيات مسؤول فقط مطلوبة" }
  }

  // 2. استخدام مفتاح الخدمة للعمليات الإدارية
  // تأكد أن هذا المفتاح مضاف في Vercel Environment Variables
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    // 3. إنشاء المستخدم في Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: 'DefaultPassword123!', 
      email_confirm: true 
    })

    if (authError) throw new Error(authError.message)

    // 4. إنشاء سجل البروفايل
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ 
          id: authUser.user.id, 
          full_name: formData.full_name, 
          role: formData.role.toLowerCase(), 
          email: formData.email 
      }])

    if (profileError) {
      // تراجع في حال الفشل
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      throw new Error(profileError.message)
    }

    revalidatePath('/admin/staff')
    return { success: true }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
