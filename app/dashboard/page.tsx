import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation'; // ضروري للتوجيه
import { revalidatePath } from 'next/cache'; // ضروري لتحديث البيانات فوراً
import { 
  Building2, MapPin, ImageIcon, 
  Save, AlignRight 
} from 'lucide-react';

export default async function NewPropertyPage() {
  // إنشاء نسخة السيرفر للتحقق من الصلاحيات قبل عرض الصفحة
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // حماية الصفحة: إذا لم يكن هناك مستخدم، ارجعه لصفحة الدخول
  if (!user) {
    redirect('/login');
  }

  async function addProperty(formData: FormData) {
    'use server';
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const rawFormData = {
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      area: parseFloat(formData.get('area') as string) || 0,
      rooms: parseInt(formData.get('rooms') as string) || 0,
      bathrooms: parseInt(formData.get('bathrooms') as string) || 0,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      image_url: formData.get('image_url') as string || null,
      status: 'available',
      created_by: user.id,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('properties')
      .insert([rawFormData]);

    if (error) {
      console.error('Error adding property:', error.message);
      return;
    }

    // --- التعديل الضروري هنا ---
    revalidatePath('/dashboard'); // يخبر Next.js أن البيانات تغيرت، حدث الشاشة
    redirect('/dashboard'); // ينقل المستخدم بعد النجاح
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">إضافة وحدة عقارية</h1>
              <p className="text-gray-500 mt-2 text-lg">أدخل البيانات الفنية للوحدة ليتم أرشفتها في النظام</p>
            </div>
          </header>

          <form action={addProperty} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">مسمى الوحدة</label>
                <div className="relative">
                  <Building2 className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    name="title"
                    required
                    type="text"
                    placeholder="مثال: فيلا الياسمين - التجمع الخامس"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">الموقع التفصيلي</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    name="location"
                    required
                    type="text"
                    placeholder="المدينة، الحي، الشارع"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'السعر (ج.م)', name: 'price', placeholder: '0.00' },
                { label: 'المساحة (م²)', name: 'area', placeholder: '0' },
                { label: 'غرف النوم', name: 'rooms', placeholder: '0' },
                { label: 'الحمامات', name: 'bathrooms', placeholder: '0' }
              ].map((item) => (
                <div key={item.name} className="space-y-3">
                  <label className="text-sm font-black text-[#0F172A] mr-1">{item.label}</label>
                  <input 
                    name={item.name}
                    required 
                    type="number" 
                    min="0"
                    placeholder={item.placeholder}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] font-bold text-[#10B981]" 
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">نوع العقار</label>
                <select 
                  name="type"
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] font-medium appearance-none"
                >
                  <option value="شقة">شقة سكنية</option>
                  <option value="فيلا">فيلا / قصر</option>
                  <option value="دوبلكس">دوبلكس</option>
                  <option value="محل تجاري">محل تجاري</option>
                  <option value="مكتب">مكتب إداري</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">رابط صورة المعرض الرئيسية</label>
                <div className="relative">
                  <ImageIcon className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    name="image_url"
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-[#0F172A] mr-1">وصف تفصيلي للوحدة</label>
              <div className="relative">
                <AlignRight className="absolute right-4 top-4 text-gray-300" size={20} />
                <textarea 
                  name="description"
                  rows={4}
                  placeholder="اكتب مميزات العقار، التشطيب، والخدمات القريبة..."
                  className="w-full pr-12 pl-6 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all resize-none font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 rounded-[2rem] font-black text-xl bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <Save size={24}/> اعتماد ونشر الوحدة
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}