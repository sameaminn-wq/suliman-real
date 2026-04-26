'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { Trash2, Edit, ExternalLink, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesManagement() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setProperties(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العقار نهائياً؟')) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) alert('خطأ في الحذف');
      else fetchProperties(); // تحديث القائمة
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="ADMIN" />
      <main className="mr-72 flex-1 p-10 text-right" dir="rtl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">إدارة الوحدات</h1>
            <p className="text-gray-500">تحكم في العقارات المعروضة في المعرض العام</p>
          </div>
          <Link href="/dashboard/properties/new" className="flex items-center gap-2 bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#059669] transition-all">
            <Plus size={20} />
            إضافة عقار جديد
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#10B981]" size={40} /></div>
          ) : (
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-gray-600 font-bold">العقار</th>
                  <th className="p-6 text-gray-600 font-bold">الموقع</th>
                  <th className="p-6 text-gray-600 font-bold">السعر</th>
                  <th className="p-6 text-gray-600 font-bold">الحالة</th>
                  <th className="p-6 text-gray-600 font-bold text-left">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={prop.image_url} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                        <span className="font-bold text-[#0F172A]">{prop.title}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-500 text-sm">{prop.location}</td>
                    <td className="p-6 font-bold text-[#10B981]">{Number(prop.price).toLocaleString()} ج.م</td>
                    <td className="p-6">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">نشط</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleDelete(prop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <Link href={`/gallery/${prop.id}`} target="_blank" className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}