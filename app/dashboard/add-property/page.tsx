'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Building2, MapPin, ImageIcon, Loader2, Save, AlignRight, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', area: '', 
    rooms: '', bathrooms: '', type: 'شقة', description: '', image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('properties').insert([{
        ...formData,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        rooms: parseInt(formData.rooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        status: 'available',
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;
      setSuccess(true);
      toast.success('تم الإضافة بنجاح');
      setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 1500);
    } catch (error: any) {
      toast.error('حدث خطأ في الحفظ');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />
      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-[#0F172A]">إضافة وحدة عقارية</h1>
            <p className="text-gray-500 mt-2">أدخل البيانات الفنية للوحدة</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input required placeholder="مسمى الوحدة" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <input required placeholder="الموقع" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <input required type="number" placeholder="السعر" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required type="number" placeholder="المساحة" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
              <input required type="number" placeholder="الغرف" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.rooms} onChange={e => setFormData({...formData, rooms: e.target.value})} />
              <input required type="number" placeholder="الحمامات" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
            </div>
            <textarea rows={4} placeholder="وصف العقار" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <input placeholder="رابط الصورة" className="w-full p-4 rounded-2xl bg-gray-50 outline-none" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            <button disabled={loading} type="submit" className="w-full py-5 rounded-[2rem] bg-[#0F172A] text-white font-black text-xl hover:bg-[#1e293b] transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'اعتماد ونشر الوحدة'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}