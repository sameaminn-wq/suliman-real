// app/actions/admin.ts
'use server'
import { createClient } from '@supabase/supabase-js'

export async function addStaffAction(formData: { email: string, full_name: string, role: string }) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: 'DefaultPassword123!', 
    email_confirm: true 
  })

  if (authError) return { success: false, error: authError.message }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert([{ 
        id: authUser.user.id, 
        full_name: formData.full_name, 
        role: formData.role.toLowerCase(), 
        email: formData.email 
    }])

  if (profileError) return { success: false, error: profileError.message }
  return { success: true }
}