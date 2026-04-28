'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { UserPlus, Shield, Trash2, Mail, BadgeCheck, X, Loader2, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { addStaffAction } from '@/app/actions/admin'; // استيراد الأكشن الآمن

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ email: '', full_name: '', role: 'employee' });

  // 1. جلب البيانات - تم إصلاح التبعيات لمنع الـ Loop 429
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('role', { ascending: true });

      if (error) {
        toast.error(`خطأ في جلب البيانات: ${error.message}`);
      } else {
        setStaff(data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // تنفيذ الجلب مرة واحدة فقط عند التحميل
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // 2. منطق الحذف
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذا الموظف؟')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      toast.error('حدث خطأ في الحذف، تأكد من الصلاحيات');
    } else {
      setStaff(prev => prev.filter(member => member.id !== id));
      toast.success('تمت إزالة الموظف بنجاح');
    }
  };

  // 3. إضافة موظف عبر الـ Server Action الآمن
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    const result = await addStaffAction({
      email: newStaff.email,
      full_name: newStaff.full_name,
      role: newStaff.role
    });

    if (!result.success) {
      toast.error(`فشل الإضافة: ${result.error}`);
    } else {
      toast.success('تم اعتماد الموظف الجديد بنجاح');
      fetchStaff(); // تحديث القائمة فوراً
      setIsModalOpen(false);
      setNewStaff({ email: '', full_name: '', role: 'employee' });
    }
    setAdding(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Toaster position="top-center" />
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10 text-right">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#10B981] mb-2 font-bold text-sm">
              <Shield size={16} />
              منطقة الإدارة العليا
            </div>
            <h1 className="text-3xl font-black text-[#0F172A]">إدارة طاقم العمل</h1>
            <p className="text-gray-500 mt-1">تحكم كامل في صلاحيات الوصول والمهام</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-[#1E293B] transition-all shadow-xl shadow-gray-200"
          >
            <UserPlus size={20} />
            إضافة موظف جديد
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#10B981] mb-4" size={48} />
            <p className="text-gray-400 font-bold">جاري مزامنة بيانات الطاقم...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <Users size={64} className="text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">لا يوجد موظفون مسجلون حالياً</h3>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-[#10B981] font-bold underline">أضف أول موظف الآن</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#10B981] border border-gray-100">
                    <Shield size={24} />
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wide uppercase ${
                    member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                    member.role === 'secretary' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {member.role === 'admin' ? 'مدير نظام' : member.role === 'secretary' ? 'سكرتارية' : 'مبيعات'}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-[#0F172A] mb-1">{member.full_name}</h3>
                <p className="text-gray-400 text-xs mb-6 flex items-center gap-2">
                   <Mail size={12} /> {member.email}
                </p>

                <div className="flex gap-3 pt-6 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all w-full flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Trash2 size={18} /> حذف العضو
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-[#10B981] p-10 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-lg shadow-emerald-200">
                <BadgeCheck size={120} className="absolute -left-8 -bottom-8 opacity-10 rotate-12" />
                <h4 className="text-sm opacity-80 mb-1 font-bold">إجمالي الطاقم</h4>
                <div className="text-6xl font-black">{staff.length}</div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 left-8 text-gray-400 hover:text-black">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black text-[#0F172A] mb-2">إضافة عضو جديد</h2>
              <p className="text-gray-400 text-sm mb-8">سيتم إنشاء حساب له وصلاحيات وصول فوراً</p>

              <form onSubmit={handleAddStaff} className="space-y-5">
                <div>
                  <label className="text-sm font-bold mr-1 block mb-2">الاسم بالكامل</label>
                  <input required className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" 
                    value={newStaff.full_name} onChange={e => setNewStaff({...newStaff, full_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mr-1 block mb-2">البريد الإلكتروني</label>
                  <input required type="email" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]" 
                    value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mr-1 block mb-2">نوع الصلاحية</label>
                  <select className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#10B981]"
                    value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                    <option value="employee">موظف مبيعات</option>
                    <option value="secretary">سكرتارية</option>
                    <option value="admin">مدير نظام</option>
                  </select>
                </div>
                <button type="submit" disabled={adding} className="w-full py-4 bg-[#10B981] text-white rounded-2xl font-black text-lg hover:bg-[#0da06f] transition-all flex justify-center items-center gap-2">
                  {adding ? <Loader2 className="animate-spin" size={20} /> : 'اعتماد الموظف'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}