'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
// تم تعديل الاستيراد لاستخدام نسخة الكلاينت المتوافقة مع السيرفر
import { createClient } from '@/lib/supabase/client'; 
import { 
  Phone, 
  MessageSquare, 
  User, 
  Clock, 
  RefreshCcw, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Customer {
  id: string;
  full_name: string;
  phone: string;
  interest: string;
  created_at: string;
  status: 'new' | 'contacted' | 'interested' | 'closed';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // إنشاء الكلاينت داخل الدالة لضمان أمان الاتصال
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Fetch Error:', error.message);
      alert('حدث خطأ أثناء جلب البيانات، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const cleanPhone = (phone: string) => phone.replace(/\s+/g, '').replace('+', '');

  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="SECRETARY" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">إدارة العملاء المحتملين (Leads)</h1>
            <p className="text-gray-500 mt-2 text-lg">تحويل الاهتمام إلى نتائج ملموسة</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="بحث عن عميل..."
                className="pr-12 pl-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#10B981] transition-all w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchCustomers}
              className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-[#10B981] shadow-sm group"
              title="تحديث البيانات"
            >
              <RefreshCcw size={20} className={loading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold">جاري مزامنة بيانات العملاء...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="p-7 text-gray-400 font-black text-xs uppercase">بيانات العميل</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase">الوحدة المستهدفة</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase text-center">توقيت الطلب</th>
                    <th className="p-7 text-gray-400 font-black text-xs uppercase text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="p-7">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] shadow-inner">
                            <User size={22} />
                          </div>
                          <div>
                            <div className="font-bold text-[#0F172A] text-lg">{customer.full_name}</div>
                            <div className="text-sm text-gray-400 font-medium">{customer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-7">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
                          <span className="text-sm font-bold text-gray-600">
                            {customer.interest || 'معاينة عامة'}
                          </span>
                        </div>
                      </td>
                      <td className="p-7 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Clock size={14} />
                            {new Date(customer.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                          </div>
                          <span className="text-[10px] text-gray-300">
                            {new Date(customer.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="p-7">
                        <div className="flex justify-center gap-3">
                          <a 
                            href={`tel:${customer.phone}`} 
                            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="اتصال هاتفي"
                          >
                            <Phone size={20} />
                          </a>
                          <a 
                            href={`https://wa.me/${cleanPhone(customer.phone)}`} 
                            target="_blank" 
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                            title="واتساب"
                          >
                            <MessageSquare size={20} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <AlertCircle size={48} className="text-gray-100" />
                          <p className="text-gray-400 text-lg font-medium italic">
                            {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'سجل العملاء فارغ حالياً'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}