'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
// نستخدم نسخة العميل هنا لأننا داخل 'use client' ولأداء عمليات التفاعل
import { supabase } from '@/lib/supabase';
import { Loader2, MapPin, Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AddPropertyPage() {
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
    setLoading(true);

    try {
      // 1. جلب بيانات المستخدم الحالي لربطه بالعقار (أمان)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }

      // 2. إرسال البيانات مع التأكد من مطابقة أسماء الأعمدة في الجدول
      const { error } = await supabase.from('properties').insert([{
        title: formData.title,
        location: formData.location,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        rooms: parseInt(formData.rooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        type: formData.type,
        description: formData.description,
        image_url: formData.image_url,
        status: 'available', // العمود الذي أضفناه
        created_by: user.id, // ربط العقار بالموظف/الآدمن الحالي
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      toast.success('تم إضافة الوحدة بنجاح');
      
      // توجيه المستخدم بعد النجاح
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error('Save Error:', error.message);
      toast.error('فشل في حفظ البيانات: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-[#0F172A]">إضافة وحدة عقارية</h1>
            <p className="text-gray-500 mt-2">أدخل البيانات الفنية للوحدة ليتم نشرها في المحفظة</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">مسمى الوحدة</label>
                <input required placeholder="مثال: فيلا ملكية بالتجمع" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">الموقع</label>
                <input required placeholder="مثال: القاهرة الجديدة" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">السعر (ج.م)</label>
                <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">المساحة (م²)</label>
                <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">الغرف</label>
                <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">الحمامات</label>
                <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-2">وصف تفصيلي</label>
              <textarea rows={4} className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 mr-2">رابط صورة العقار</label>
              <input placeholder="https://..." className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-5 rounded-[2rem] bg-[#0F172A] text-white font-black text-xl hover:bg-[#1e293b] transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={24} /> اعتماد ونشر الوحدة</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}