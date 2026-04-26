'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { Loader2, Building2, MapPin, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PropertiesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (!error) setData(data);
      setLoading(false);
    };
    fetchProps();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster />
      <Sidebar role="ADMIN" />
      <main className="mr-72 flex-1 p-10">
        <h1 className="text-3xl font-black text-[#0F172A] mb-8">محفظة العقارات</h1>
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#10B981]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((prop) => (
              <div key={prop.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="h-48 bg-gray-200 relative">
                  <img src={prop.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-[#10B981]">{prop.price.toLocaleString()} ج.م</div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-lg text-[#0F172A] mb-2">{prop.title}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-2"><MapPin size={14}/> {prop.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}