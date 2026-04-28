import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DollarSign, Home, Users, TrendingUp } from 'lucide-react';

// تكتيك الأمان القصوى: منع الرندرة الثابتة تماماً
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // إنشاء العميل داخل الدالة
  const supabase = await createClient();

  // جلب المستخدم
  const { data: { user }, error } = await supabase.auth.getUser();

  // التوجيه للمسار الخاص بك إذا لم يجد مستخدم
  if (error || !user) {
    redirect('/same-2090');
  }

  const stats = [
    { title: 'إجمالي المبيعات', value: '45,200,000 ج.م', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'الوحدات المتاحة', value: '128', icon: Home, color: 'bg-[#10B981]' },
    { title: 'العملاء النشطين', value: '1,420', icon: Users, color: 'bg-purple-500' },
    { title: 'نسبة النمو', value: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-[#0F172A]">نظرة عامة</h1>
            <p className="text-gray-500 mt-1">مرحباً بك، سيد سليمان.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-[#0F172A]">{user.email?.split('@')[0]}</p>
              <p className="text-xs text-[#10B981]">المدير التنفيذي</p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.email}&background=10B981&color=fff`} alt="User" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100">
              <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6`}>
                <s.icon size={24} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{s.title}</p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{s.value}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}