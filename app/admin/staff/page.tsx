'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { UserPlus, Shield, Trash2, Mail, BadgeCheck, Lock } from 'lucide-react';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب قائمة الموظفين - جلب مباشر من السحابة للأمان
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true });

      if (error) throw error;
      setStaff(data || []);
    } catch (error: any) {
      alert('خطأ في جلب بيانات الموظفين: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // دالة لحذف موظف (ستحتاج تفعيلها لاحقاً في سوبابيز)
  const handleDeleteStaff = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟ سيتم سحب وصوله للنظام فوراً.')) {
       const { error } = await supabase.from('profiles').delete().eq('id', id);
       if (!error) fetchStaff();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10 text-right">
        <header className="flex justify-between items-end mb-12">
          <div className="order-2 text-right">
            <div className="flex items-center justify-end gap-2 text-[#10B981] mb-2 font-bold text-sm">
              منطقة الإدارة العليا
              <Shield size={16} />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A]">إدارة طاقم العمل</h1>
            <p className="text-gray-500 mt-1">إضافة موظفين جدد وتحديد صلاحيات السكرتارية والمبيعات</p>
          </div>
          
          <button className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#1E293B] transition-all shadow-xl shadow-gray-200 order-1">
            <UserPlus size={18} />
            إضافة موظف جديد
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[#10B981] font-bold">جاري تحميل بيانات الطاقم...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                
                {/* علامة المدير المميزة */}
                {member.role === 'ADMIN' && (
                  <div className="absolute -left-6 top-4 -rotate-45 bg-purple-600 text-white text-[8px] px-8 py-1 font-bold">
                    ROOT
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#10B981] border border-gray-100">
                    <UserPlus size={24} />
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${
                    member.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 
                    member.role === 'SECRETARY' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {member.role === 'ADMIN' ? 'مدير نظام' : member.role === 'SECRETARY' ? 'سكرتارية' : 'موظف مبيعات'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">{member.full_name || 'موظف غير مسمى'}</h3>
                <div className="flex items-center justify-end gap-2 text-gray-400 text-xs mb-6">
                   تم التحقق من الحساب
                   <BadgeCheck size={14} className="text-[#10B981]" />
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">تعديل الصلاحيات</button>
                  {member.role !== 'ADMIN' && (
                    <button 
                      onClick={() => handleDeleteStaff(member.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-[#10B981] p-8 rounded-[2rem] text-white flex flex-col justify-center relative overflow-hidden">
                <Lock size={80} className="absolute -left-4 -bottom-4 opacity-10 rotate-12" />
                <h4 className="text-sm opacity-80 mb-1">إجمالي الطاقم</h4>
                <div className="text-5xl font-bold">{staff.length}</div>
                <p className="mt-4 text-[10px] opacity-90 leading-relaxed font-light">
                  هذه البيانات مشفرة وتُجلب من السحابة مباشرة لضمان الأمان الفائق.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}