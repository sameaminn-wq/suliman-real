'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Home, BedDouble, Bath, Maximize, Loader2 } from 'lucide-react';

export default function GalleryPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      // جلب البيانات من جدول properties وترتيبها من الأحدث للأقدم
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error.message);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-4" size={40} />
          <p className="text-gray-500 font-bold">جاري تحميل المعرض العقاري...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20" dir="rtl">
      {/* رأس الصفحة (Header) */}
      <div className="bg-white border-b border-gray-100 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            استكشف وحداتنا <span className="text-[#10B981]">المميزة</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            نقدم لك مجموعة مختارة من أرقى العقارات التي تلبي تطلعاتك، من الشقق العصرية إلى الفيلات الفاخرة.
          </p>
        </div>
      </div>

      {/* شبكة العقارات */}
      <div className="max-w-7xl mx-auto px-6">
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <Home className="mx-auto text-gray-300 mb-4" size={50} />
            <p className="text-gray-500 text-xl">لا توجد عقارات معروضة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div 
                key={prop.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group"
              >
                {/* صورة العقار */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={prop.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-[#10B981] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {prop.type || 'عقار'}
                  </div>
                </div>

                {/* تفاصيل العقار */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#0F172A] leading-tight flex-1">{prop.title}</h3>
                    <p className="text-[#10B981] font-black text-xl mr-2">
                      {Number(prop.price).toLocaleString()} <span className="text-xs">ج.م</span>
                    </p>
                  </div>

                  <div className="flex items-center text-gray-400 mb-6 gap-1">
                    <MapPin size={16} className="text-[#10B981]" />
                    <span className="text-sm font-medium">{prop.location}</span>
                  </div>

                  {/* المميزات (المساحة، الغرف، الخ) */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 mb-6">
                    <div className="flex flex-col items-center gap-1">
                      <BedDouble size={18} className="text-gray-400" />
                      <span className="text-xs font-bold text-[#0F172A]">{prop.rooms} غرف</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-gray-50">
                      <Bath size={18} className="text-gray-400" />
                      <span className="text-xs font-bold text-[#0F172A]">{prop.bathrooms} حمام</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Maximize size={18} className="text-gray-400" />
                      <span className="text-xs font-bold text-[#0F172A]">{prop.area} م²</span>
                    </div>
                  </div>

                  {/* زر التفاصيل */}
                  <Link href={`/gallery/${prop.id}`} className="block">
                    <button className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#1E293B] transition-all shadow-lg shadow-gray-200">
                      تفاصيل العقار
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}