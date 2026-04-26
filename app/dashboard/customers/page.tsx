'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Phone, MessageSquare, User, Clock, RefreshCcw } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات من Supabase
  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setCustomers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="SECRETARY" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">طلبات العملاء المهتمين</h1>
            <p className="text-gray-500 mt-1">إدارة وتحويل العملاء المحتملين إلى مبيعات ناجحة</p>
          </div>
          <button 
            onClick={fetchCustomers}
            className="p-3 bg-white border rounded-2xl hover:bg-gray-50 transition-all text-[#10B981]"
            title="تحديث البيانات"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-bounce text-[#10B981] font-bold text-lg">جاري تحميل بيانات العملاء...</div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-gray-400 font-bold text-xs uppercase">العميل</th>
                  <th className="p-6 text-gray-400 font-bold text-xs uppercase">العقار المهتم به</th>
                  <th className="p-6 text-gray-400 font-bold text-xs uppercase">تاريخ الطلب</th>
                  <th className="p-6 text-gray-400 font-bold text-xs uppercase text-center">التواصل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.length > 0 ? customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-[#10B981]">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-[#0F172A]">{customer.full_name}</div>
                          <div className="text-xs text-gray-400">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {customer.interest || 'غير محدد'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={14} />
                        {new Date(customer.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <a href={`tel:${customer.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                          <Phone size={18} />
                        </a>
                        <a href={`https://wa.me/${customer.phone}`} target="_blank" className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                          <MessageSquare size={18} />
                        </a>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-400">
                      لا يوجد طلبات عملاء حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}