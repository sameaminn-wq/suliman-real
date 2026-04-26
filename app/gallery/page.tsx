'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Maximize, BedDouble, Bath, Loader2, Building2 } from 'lucide-react';
import Image from 'next/image';

// تعريف هيكل البيانات لضمان دقة الكود ومنع الثغرات المنطقية
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  rooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image_url?: string;
  status: 'available' | 'sold' | 'rented';
}

export default function GalleryPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available') // عرض المتاح فقط كإجراء منطقي
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans" dir="rtl">
      {/* Header المطور */}
      <div className="bg-white py-20 border-b border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full -mr-16 -mt-16"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
          معرض العقارات <span className="text-[#10B981]">الفاخرة</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto px-6 text-lg">
          استثمر في مستقبلك مع خياراتنا العقارية الأكثر تميزاً في السوق
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-[#10B981] animate-spin mb-4" />
            <span className="text-gray-500 font-medium">جاري فحص وتنسيق الوحدات...</span>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">لا توجد وحدات متاحة حالياً</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div 
                key={prop.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="relative h-72 bg-gray-100 overflow-hidden">
                  <img 
                    src={prop.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    {prop.type}
                  </div>
                  <div className="absolute bottom-5 left-5 bg-[#10B981] text-white px-4 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                    {Number(prop.price).toLocaleString()} ج.م
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2 group-hover:text-[#10B981] transition-colors leading-tight">
                    {prop.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <MapPin size={16} className="text-gray-300" />
                    {prop.location}
                  </div>

                  <div className="flex items-center justify-between py-5 border-y border-gray-50 mb-6">
                    <div className="flex items-center gap-2">
                      <BedDouble size={20} className="text-[#10B981]" />
                      <span className="text-sm font-bold text-[#0F172A]">{prop.rooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={20} className="text-[#10B981]" />
                      <span className="text-sm font-bold text-[#0F172A]">{prop.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize size={20} className="text-[#10B981]" />
                      <span className="text-sm font-bold text-[#0F172A]">{prop.area} م²</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#10B981] transition-all duration-300 shadow-lg shadow-gray-200">
                    استعراض التفاصيل الكاملة
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