'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Maximize, BedDouble, Bath, AlertCircle } from 'lucide-react';

// تحديد نوع البيانات لضمان دقة الكود ومنع الثغرات المنطقية
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  rooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  type: string;
}

export default function GalleryPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        // طلب البيانات من Supabase
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          // طباعة الخطأ التقني في الكونسول للمطور
          console.error('--- Supabase Error Details ---');
          console.error('Code:', error.code);
          console.error('Message:', error.message);
          console.error('Hint:', error.hint);
          
          setErrorMessage(`فشل جلب البيانات: ${error.message}`);
        } else if (!data || data.length === 0) {
          console.warn('الاستعلام نجح لكن الجدول فارغ أو الـ RLS يمنع القراءة.');
          setProperties([]);
        } else {
          console.log('تم جلب البيانات بنجاح:', data);
          setProperties(data);
        }
      } catch (err: any) {
        console.error('Unexpected System Error:', err);
        setErrorMessage('حدث خطأ غير متوقع في النظام.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-white py-16 border-b text-center">
        <h1 className="text-4xl font-bold text-[#0F172A] mb-4">معرض العقارات الفاخرة</h1>
        <p className="text-gray-500 max-w-2xl mx-auto px-6">
          اكتشف مجموعة مختارة بعناية من أرقى الوحدات السكنية والتجارية
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* حالة التحميل */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#10B981] font-bold">جاري فحص قاعدة البيانات...</p>
          </div>
        )}

        {/* حالة وجود خطأ */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4 mb-8">
            <AlertCircle className="shrink-0" />
            <div>
              <p className="font-bold">تنبيه تقني:</p>
              <p className="text-sm">{errorMessage}</p>
              <p className="text-xs mt-2 opacity-70">افتح Console المتصفح (F12) لمزيد من التفاصيل.</p>
            </div>
          </div>
        )}

        {/* حالة عدم وجود بيانات */}
        {!loading && !errorMessage && properties.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400">لا توجد عقارات متاحة حالياً أو لا تملك صلاحية الوصول.</p>
          </div>
        )}

        {/* عرض البيانات */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="relative h-64 bg-gray-200">
                  <img 
                    src={prop.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#10B981] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {prop.type}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#0F172A] leading-tight">{prop.title}</h3>
                    <div className="text-[#10B981] font-bold text-lg">
                      {Number(prop.price).toLocaleString()} <span className="text-xs">ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400 text-sm mb-6">
                    <MapPin size={14} />
                    {prop.location}
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-50">
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <BedDouble size={18} className="text-[#10B981]" />
                      <span className="text-xs font-bold">{prop.rooms} غرف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-500 border-x border-gray-50">
                      <Bath size={18} className="text-[#10B981]" />
                      <span className="text-xs font-bold">{prop.bathrooms} حمام</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <Maximize size={18} className="text-[#10B981]" />
                      <span className="text-xs font-bold">{prop.area} م²</span>
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-[#0F172A] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#1E293B] transition-all">
                    تفاصيل العقار
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}