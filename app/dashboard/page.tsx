import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  Building2,
  MapPin,
  Save,
} from 'lucide-react'

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // يضمن العمل في بيئة السيرفر الصحيحة

export default async function NewPropertyPage() {
  // السطر 14 يجب أن يكون هكذا:
  const supabase = await createClient();

  // 1. جلب الجلسة للتأكد من تسجيل الدخول
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect('/login')
  }

  // 2. جلب دور المستخدم الحقيقي من قاعدة البيانات (جدول Profiles مثلاً)
  // نفترض أن لديك حقل 'role' في جدول 'profiles' مرتبط بـ user.id
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // إذا لم نجد دوراً، نحدد دور افتراضي "EMPLOYEE" أو نعيد التوجيه (للأمان)
  const userRole = profile?.role || 'EMPLOYEE'

  async function addProperty(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      redirect('/login')
    }

    // ملاحظة أمنية: يفضل هنا أيضاً فحص صلاحية المستخدم (هل هو ADMIN أو SECRETARY؟) قبل الإدخال
    
    const rawFormData = {
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      area: parseFloat(formData.get('area') as string) || 0,
      rooms: parseInt(formData.get('rooms') as string) || 0,
      bathrooms: parseInt(formData.get('bathrooms') as string) || 0,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      image_url: (formData.get('image_url') as string) || null,
      status: 'available',
      created_by: session.user.id,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('properties')
      .insert([rawFormData])

    if (error) {
      console.error('Database Error:', error.message)
      return
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* تمرير الدور الحقيقي المستخرج من السيرفر */}
      <Sidebar role={userRole} />

      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                إضافة وحدة عقارية
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                أنت الآن تقوم بالإضافة بصلاحية: <span className="text-[#10B981] font-bold">{userRole}</span>
              </p>
            </div>
          </header>

          <form
            action={addProperty}
            className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50"
          >
            {/* ... بقية حقول الفورم ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">
                  مسمى الوحدة
                </label>
                <div className="relative">
                  <Building2 className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input
                    name="title"
                    required
                    type="text"
                    placeholder="مثال: فيلا الياسمين - التجمع الخامس"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">
                  الموقع التفصيلي
                </label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input
                    name="location"
                    required
                    type="text"
                    placeholder="المدينة، الحي، الشارع"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-[2rem] font-black text-xl bg-[#0F172A] text-white hover:bg-[#1e293b] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-[#0F172A]/20"
            >
              <Save size={24} />
              اعتماد ونشر الوحدة
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}