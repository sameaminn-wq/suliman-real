'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MapPin, Maximize, BedDouble, Bath, CheckCircle2, MessageCircle, Phone } from 'lucide-react';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // 1. محاولة الجلب من المحرك المحلي (الأسرع دائمًا في نسخة الديسك توب)
        const localRes = await fetch(`/api/properties/${id}`);
        if (localRes.ok) {
          const localData = await localRes.json();
          setProperty(localData);
          setLoading(false);
          
          // تحديث المشاهدات في الخلفية دون تعطيل المستخدم
          supabase.from('properties')
            .update({ views: (localData.views || 0) + 1 })
            .eq('id', id)
            .then();
            
          return; 
        }

        // 2. إذا لم يوجد محلياً (مثلاً أول مرة يفتح)، نجلب من سوبابيز
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (!error && data) {
          setProperty(data);
        }
      } catch (err) {
        console.error("فشل الجلب الهجين:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#10B981] font-bold">جاري تحميل تفاصيل الوحدة...</p>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
      العقار غير موجود أو تم حذفه
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* المعرض المصغر - صورة العقار الرئيسية */}
      <div className="h-[60vh] w-full relative">
        <img 
          src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
          className="w-full h-full object-cover"
          alt={property.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-10 right-10 text-white text-right">
          <span className="bg-[#10B981] px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
            {property.type || 'وحدة سكنية'}
          </span>
          <h1 className="text-5xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center justify-end gap-2 opacity-90">
            {property.location}
            <MapPin size={18} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
        {/* التفاصيل على اليمين */}
        <div className="lg:col-span-2 text-right order-2 lg:order-1">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">عن هذه الوحدة</h2>
          <p className="text-gray-600 leading-relaxed mb-10 text-lg">
            {property.description || 'لا يوجد وصف متاح لهذا العقار حالياً. يرجى التواصل مع المكتب لمزيد من التفاصيل.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#F8FAFC] p-8 rounded-[2.5rem] border border-gray-100">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm mb-2">المساحة</span>
              <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                <Maximize className="text-[#10B981]" size={20} />
                {property.area} م²
              </div>
            </div>
            <div className="flex flex-col items-center border-r border-gray-200">
              <span className="text-gray-400 text-sm mb-2">الغرف</span>
              <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                <BedDouble className="text-[#10B981]" size={20} />
                {property.rooms}
              </div>
            </div>
            <div className="flex flex-col items-center border-r border-gray-200">
              <span className="text-gray-400 text-sm mb-2">الحمامات</span>
              <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                <Bath className="text-[#10B981]" size={20} />
                {property.bathrooms || 0}
              </div>
            </div>
            <div className="flex flex-col items-center border-r border-gray-200">
              <span className="text-gray-400 text-sm mb-2">السعر</span>
              <div className="font-bold text-[#10B981] text-xl">
                {Number(property.price).toLocaleString()} <span className="text-xs text-gray-500 mr-1">ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* كارت التواصل على اليسار */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white border border-gray-100 shadow-2xl shadow-emerald-100/50 p-8 rounded-[2.5rem] sticky top-32">
            <h3 className="text-xl font-bold text-[#0F172A] mb-6 text-center">مهتم بهذا العقار؟</h3>
            
            <div className="space-y-4">
              <a 
                href={`https://wa.me/+201156383133?text=أنا مهتم بالعقار: ${property.title}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-3 bg-[#10B981] text-white py-4 rounded-2xl font-bold hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
              >
                <MessageCircle size={20} />
                تواصل عبر واتساب
              </a>
              
              <a 
                href="tel:+201156383133"
                className="w-full flex items-center justify-center gap-3 bg-[#0F172A] text-white py-4 rounded-2xl font-bold hover:bg-[#1E293B] transition-all"
              >
                <Phone size={20} />
                اتصال هاتفي
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50">
              <div className="flex items-center justify-end gap-3 text-sm text-gray-500 mb-4">
                متاح للمعاينة الفورية
                <CheckCircle2 size={16} className="text-[#10B981]" />
              </div>
              <div className="flex items-center justify-end gap-3 text-sm text-gray-500">
                أوراق ملكية مسجلة
                <CheckCircle2 size={16} className="text-[#10B981]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}