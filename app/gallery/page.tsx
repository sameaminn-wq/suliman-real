'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar'; // تأكد من وجود المكون
import { 
  Building2, Plus, Search, Filter, 
  MoreVertical, Edit3, Trash2, ExternalLink,
  Loader2, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  status: 'available' | 'sold' | 'rented';
  type: string;
  created_at: string;
}

export default function PropertiesStudio() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. جلب البيانات من Supabase
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast.error('حدث خطأ أثناء جلب العقارات: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // 2. منطق الحذف السريع
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار نهائياً؟')) return;

    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) {
      toast.error('فشل الحذف: تأكد من صلاحياتك');
    } else {
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('تم حذف العقار بنجاح');
    }
  };

  // تصفية البحث
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />

      <main className="mr-72 flex-1 p-8">
        {/* Header الداشبورد */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">استوديو العقارات</h1>
            <p className="text-gray-500 mt-1">إدارة المخزون العقاري وتحديث الحالات</p>
          </div>
          <button className="bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#0da06f] transition-all shadow-lg shadow-emerald-100">
            <Plus size={20} />
            إضافة عقار جديد
          </button>
        </div>

        {/* أدوات التحكم (البحث والفلترة) */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="ابحث بالعنوان أو الموقع..."
              className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-all">
            <Filter size={18} />
            تصفية
          </button>
        </div>

        {/* عرض البيانات */}
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-[#10B981]" size={40} />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-sm">
                  <th className="p-6 font-bold">العقار</th>
                  <th className="p-6 font-bold">السعر</th>
                  <th className="p-6 font-bold">الحالة</th>
                  <th className="p-6 font-bold">تاريخ الإضافة</th>
                  <th className="p-6 font-bold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#10B981]">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <div className="font-black text-[#0F172A]">{prop.title}</div>
                          <div className="text-xs text-gray-400">{prop.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-[#0F172A]">
                      {Number(prop.price).toLocaleString()} ج.م
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${
                        prop.status === 'available' ? 'bg-emerald-100 text-emerald-600' :
                        prop.status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {prop.status === 'available' && <CheckCircle2 size={12} />}
                        {prop.status === 'sold' && <AlertCircle size={12} />}
                        {prop.status === 'rented' && <Clock size={12} />}
                        {prop.status === 'available' ? 'متاح' : prop.status === 'sold' ? 'مباع' : 'مؤجر'}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-400 font-medium">
                      {new Date(prop.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2.5 text-gray-400 hover:text-[#10B981] hover:bg-emerald-50 rounded-lg transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prop.id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 rounded-lg transition-all">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-bold">
                لا توجد عقارات تطابق بحثك حالياً.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}