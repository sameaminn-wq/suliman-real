// إزالة 'use client' لأننا سنحولها لـ Server Component لجلب البيانات بأمان
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server'; // استخدام نسخة السيرفر المؤمنة
import { AlertCircle } from 'lucide-react';
import CustomersTable from './CustomersTable'; // استدعاء مكون الجدول التفاعلي

export default async function CustomersPage() {
  // جلب البيانات مباشرة من السيرفر قبل تحميل الصفحة
  const supabase = await createClient();
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="SECRETARY" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">إدارة العملاء المحتملين (Leads)</h1>
          <p className="text-gray-500 mt-2 text-lg">تحويل الاهتمام إلى نتائج ملموسة</p>
        </div>

        {error ? (
          <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 flex flex-col items-center gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <p className="text-red-700 font-bold">حدث خطأ أثناء جلب البيانات: {error.message}</p>
          </div>
        ) : (
          /* نمرر البيانات لمكون الكلاينت (الجدول) ليقوم بالبحث والتصفية دون إعادة تحميل الصفحة */
          <CustomersTable initialCustomers={customers || []} />
        )}
      </main>
    </div>
  );
}