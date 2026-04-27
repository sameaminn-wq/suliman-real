'use server'
import { createClient } from '@supabase/supabase-js'
// قم بتغيير هذا السطر:
// import { createClient } from '@/utils/supabase/server';

// إلى هذا السطر الصحيح بناءً على هيكلة ملفاتك:
import { createClient } from '@/lib/supabase/server';import { revalidatePath } from 'next/cache'

export async function addStaffAction(formData: { email: string, full_name: string, role: string }) {
  
  // 1. الأمان أولاً: التحقق من أن المستدعي هو "أدمن" فعلياً
  const userClient = createServerClient()
  const { data: { user } } = await userClient.auth.getUser()
  
  if (!user) return { success: false, error: "غير مصرح لك" }

  const { data: adminCheck } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminCheck?.role !== 'admin') {
    return { success: false, error: "صلاحيات مسؤول فقط مطلوبة" }
  }

  // 2. استخدام مفتاح الخدمة (Admin Client) فقط بعد التأكد من الهوية
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 3. إنشاء حساب المستخدم في Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: 'DefaultPassword123!', 
    email_confirm: true 
  })

  if (authError) return { success: false, error: authError.message }

  // 4. إنشاء الملف الشخصي في قاعدة البيانات
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([{ 
        id: authUser.user.id, 
        full_name: formData.full_name, 
        role: formData.role.toLowerCase(), 
        email: formData.email 
    }])

  if (profileError) {
    // في حال فشل إنشاء البروفايل، يفضل حذف المستخدم من Auth لضمان نظافة البيانات
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
    return { success: false, error: profileError.message }
  }

  revalidatePath('/admin/staff')
  return { success: true }
}