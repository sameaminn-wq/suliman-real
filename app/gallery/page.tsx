'use client';

import { useState, useEffect } from 'react';
// استيراد المحرك الهجين الجديد بدلاً من سوبابيز المباشر
import { getProperties } from '@/lib/db'; 
import { Home, MapPin, Maximize, BedDouble, Bath, Search } from 'lucide-react';

export default function GalleryPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // هنا السحر: سيحاول الجلب من SQLite أولاً ثم المزامنة مع سوبابيز
        const data = await getProperties();
        
        if (data) {
          setProperties(data);
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات الهجينة:", error);
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
          اكتشف مجموعة مختارة بعناية من أرقى الوحدات السكنية والتجارية التي تناسب تطلعاتك
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center py-20 text-[#10B981] font-bold animate-pulse">
            جاري تحميل الوحدات من المخزن المحلي والسحابي...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                {/* Image Section */}
                <div className="relative h-64 bg-gray-200">
                  <img 
                    src={prop.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-[#10B981] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {prop.type || 'عقار'}
                  </div>
                  {/* علامة توضح إذا كان العقار محفوظ محلياً فقط أم تمت مزامنته */}
                  {prop.isSynced === false && (
                    <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-bold">
                      بانتظار المزامنة...
                    </div>
                  )}
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
                      <span className="text-xs font-bold">{prop.bathrooms || 0} حمام</span>
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