'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Building2, MapPin, ImageIcon, Loader2, Save } from 'lucide-react';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    rooms: '',
    bathrooms: '',
    type: 'شقة',
    description: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // حماية ضد النقر المتعدد

    setLoading(true);

    try {
      const { error } = await supabase
        .from('properties')
        .insert([
          { 
            ...formData,
            price: parseFloat(formData.price) || 0,
            area: parseFloat(formData.area) || 0,
            rooms: parseInt(formData.rooms) || 0,
            bathrooms: parseInt(formData.bathrooms) || 0,
            created_at: new Date().toISOString(), // تأمين وقت الإنشاء
          }
        ]);

      if (error) throw error;

      alert('✅ تم إضافة العقار بنجاح!');
      router.push('/dashboard/properties'); 
      router.refresh(); // لتحديث البيانات فوراً
    } catch (error: any) {
      alert('❌ خطأ في النظام: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* تأكد من أن الـ Sidebar يعكس الصلاحية الصحيحة، هنا استخدمنا ADMIN */}
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10 text-right" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">إضافة وحدة جديدة</h1>
              <p className="text-gray-500 mt-2">أدخل تفاصيل العقار بدقة لتظهر بشكل جذاب في المعرض</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold">
              لوحة التحكم الآمنة
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            
            {/* عنوان العقار والموقع */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">عنوان العقار</label>
                <div className="relative">
                  <Building2 className="absolute right-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="مثال: شقة دوبلكس بالتجمع"
                    className="w-full pr-12 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">الموقع</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    required
                    type="text"
                    placeholder="المدينة، الحي"
                    className="w-full pr-12 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* الأرقام الحساسة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'السعر (ج.م)', key: 'price' },
                { label: 'المساحة (م²)', key: 'area' },
                { label: 'غرف النوم', key: 'rooms' },
                { label: 'الحمامات', key: 'bathrooms' }
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">{item.label}</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    className="w-full p-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" 
                    onChange={(e) => setFormData({...formData, [item.key]: e.target.value})} 
                  />
                </div>
              ))}
            </div>

            {/* الصورة والنوع */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">نوع العقار</label>
                <select 
                  className="w-full p-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]"
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>شقة</option>
                  <option>فيلا</option>
                  <option>دوبلكس</option>
                  <option>محل تجاري</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رابط الصورة (URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute right-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="url" // تغيير النوع لـ url للتحقق التلقائي
                    placeholder="https://..."
                    className="w-full pr-12 py-3 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]"
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#10B981] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#059669] disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> نشر العقار الآن</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}