'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PropertiesPage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: properties, error: supabaseError } = await supabase
        .from('properties')
        .select('id, title, location, price, image_url, created_at')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setData(properties || []);
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ غير متوقع أثناء جلب البيانات';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProps();
  }, [fetchProps]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">محفظة العقارات</h1>
          <button 
            onClick={() => fetchProps()} 
            className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            تحديث البيانات
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-[#10B981]" size={48} />
            <p className="text-gray-500 font-medium">جاري تحميل العقارات...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex flex-col items-center gap-4">
            <AlertCircle className="text-red-500" size={40} />
            <p className="text-red-700 font-bold">{error}</p>
            <button onClick={fetchProps} className="text-[#10B981] underline">إعادة المحاولة</button>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400">لا توجد عقارات مضافة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((prop) => (
              <div 
                key={prop.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={prop.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur shadow-lg px-4 py-1.5 rounded-2xl text-sm font-black text-[#10B981]">
                    {prop.price?.toLocaleString('ar-EG') ?? '0'} ج.م
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-black text-xl text-[#0F172A] mb-3 group-hover:text-[#10B981] transition-colors">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} className="text-[#10B981]" />
                    <span className="text-sm font-medium">{prop.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}