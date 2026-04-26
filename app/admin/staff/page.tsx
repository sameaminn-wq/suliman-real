'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { UserPlus, Shield, Trash2, Mail, BadgeCheck } from 'lucide-react';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب قائمة الموظفين من جدول profiles
  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('role', { ascending: true });

    if (!error) {
      setStaff(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* تأكد من تمرير Role المدير ليظهر له كل الخيارات */}
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10 text-right">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#10B981] mb-2 font-bold text-sm">
              <Shield size={16} />
              منطقة الإدارة العليا
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A]">إدارة طاقم العمل</h1>
            <p className="text-gray-500 mt-1">إضافة موظفين جدد وتحديد صلاحيات السكرتارية والمبيعات</p>
          </div>
          
          <button className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#1E293B] transition-all shadow-xl shadow-gray-200">
            <UserPlus size={18} />
            إضافة موظف جديد
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-[#10B981] font-bold">جاري تحميل بيانات الطاقم...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#10B981] border border-gray-100">
                    <UserPlus size={24} />
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${
                    member.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 
                    member.role === 'SECRETARY' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {member.role === 'ADMIN' ? 'مدير نظام' : member.role === 'SECRETARY' ? 'سكرتارية' : 'موظف مبيعات'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">{member.full_name || 'موظف غير مسمى'}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
                  <Mail size={14} />
                  الوصول مفعل للنظام
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">تعديل</button>
                  <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* بطاقة سريعة للإحصائيات */}
            <div className="bg-[#10B981] p-8 rounded-[2rem] text-white flex flex-col justify-center relative overflow-hidden">
                <BadgeCheck size={80} className="absolute -left-4 -bottom-4 opacity-10 rotate-12" />
                <h4 className="text-sm opacity-80 mb-1">إجمالي الطاقم</h4>
                <div className="text-5xl font-bold">{staff.length}</div>
                <p className="mt-4 text-xs opacity-90 leading-relaxed font-light">
                  تأكد من مراجعة صلاحيات الموظفين بشكل دوري لضمان أمان البيانات.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}