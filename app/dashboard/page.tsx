import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  Building2,
  MapPin,
  ImageIcon,
  Save,
  AlignRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewPropertyPage() {
  // ✅ بدون await
  const supabase = createClient()

  // ✅ فحص الجلسة الحقيقي
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ✅ لو لا يوجد جلسة -> دخول
  if (!session?.user) {
    redirect('/login')
  }

  async function addProperty(formData: FormData) {
    'use server'

    const supabase = createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      redirect('/login')
    }

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
      console.error(error)
      return
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="ADMIN" />

      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
                إضافة وحدة عقارية
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                أدخل البيانات الفنية للوحدة ليتم أرشفتها في النظام
              </p>
            </div>
          </header>

          <form
            action={addProperty}
            className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">
                  مسمى الوحدة
                </label>
                <div className="relative">
                  <Building2
                    className="absolute right-4 top-4 text-gray-300"
                    size={20}
                  />
                  <input
                    name="title"
                    required
                    type="text"
                    placeholder="مثال: فيلا الياسمين - التجمع الخامس"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">
                  الموقع التفصيلي
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute right-4 top-4 text-gray-300"
                    size={20}
                  />
                  <input
                    name="location"
                    required
                    type="text"
                    placeholder="المدينة، الحي، الشارع"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-[2rem] font-black text-xl bg-[#0F172A] text-white hover:bg-[#1e293b] transition-all flex items-center justify-center gap-3"
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