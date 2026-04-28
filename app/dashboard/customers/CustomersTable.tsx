'use client';

import { useState } from 'react';
import { Phone, MessageSquare, User, Clock, Search, RefreshCcw, AlertCircle } from 'lucide-react';

export default function CustomersTable({ initialCustomers }: { initialCustomers: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const cleanPhone = (phone: string) => phone.replace(/\s+/g, '').replace('+', '');

  const filteredCustomers = initialCustomers.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  return (
    <>
      <div className="flex justify-end mb-6">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="بحث عن عميل..."
            className="pr-12 pl-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#10B981] transition-all w-80 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
                      <span className="text-sm font-bold text-gray-600">{customer.interest || 'معاينة عامة'}</span>
                    </div>
                  </td>
                  <td className="p-7 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Clock size={14} />
                        {new Date(customer.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                      </div>
                    </div>
                  </td>
                  <td className="p-7">
                    <div className="flex justify-center gap-3">
                      <a href={`tel:${customer.phone}`} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Phone size={20} />
                      </a>
                      <a href={`https://wa.me/${cleanPhone(customer.phone)}`} target="_blank" className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                        <MessageSquare size={20} />
                      </a>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-32 text-center text-gray-400 font-medium">لا توجد نتائج</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}