'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { 
  Trash2, ExternalLink, Loader2, Plus, 
  Building2, Search, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image_url: string;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error('فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return;
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف العقار بنجاح');
    } catch (error: any) {
      toast.error('فشل الحذف');
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">إدارة الأصول</h1>
            <p className="text-gray-500 mt-2">تحكم كامل في محفظة العقارات</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text"
                placeholder="بحث..."
                className="pr-12 pl-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#10B981] w-72 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link 
              href="/dashboard/add-property" 
              className="flex items-center gap-3 bg-[#10B981] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#0da06f] transition-all shadow-lg shadow-emerald-100"
            >
              <Plus size={20} /> إضافة عقار
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[2.8rem] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#10B981] mb-4" size={40} />
              <p className="text-gray-400 font-medium">جاري التجهيز...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-50">
                  <tr>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase">الوحدة</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase">الموقع</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase">القيمة</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase text-center">الحالة</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase text-left">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50/30 transition-all group">
                      <td className="p-7">
                        <div className="flex items-center gap-5">
                          <img src={prop.image_url || '/placeholder.png'} className="w-14 h-14 rounded-2xl object-cover border border-gray-100" alt="" />
                          <div>
                            <span className="block font-black text-[#0F172A] text-lg">{prop.title}</span>
                            <span className="text-[10px] text-gray-300 font-mono">ID: {prop.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-7 text-gray-500 font-medium">{prop.location}</td>
                      <td className="p-7 font-black text-[#10B981] text-lg">{Number(prop.price).toLocaleString()} ج.م</td>
                      <td className="p-7 text-center">
                        <span className="bg-emerald-50 text-[#10B981] px-4 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> نشط
                        </span>
                      </td>
                      <td className="p-7">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/gallery/${prop.id}`} target="_blank" className="p-3 text-gray-400 hover:text-[#10B981]"><ExternalLink size={20} /></Link>
                          <button onClick={() => handleDelete(prop.id)} className="p-3 text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}