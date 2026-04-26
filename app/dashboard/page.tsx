import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Home, Users, TrendingUp } from 'lucide-react';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // حماية الصفحة: إذا لم تكن هناك جلسة، ارجع لصفحة الدخول
  if (!session) { redirect('/same-2090'); }

  // جلب عدد الوحدات الحقيقي من Supabase
  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const stats = [
    { title: 'إجمالي المبيعات', value: '45,200,000 ج.م', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'الوحدات المتاحة', value: propertiesCount?.toString() || '0', icon: Home, color: 'bg-[#10B981]' },
    { title: 'العملاء النشطين', value: '1,420', icon: Users, color: 'bg-purple-500' },
    { title: 'نسبة النمو', value: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="ADMIN" />
      <main className="mr-72 flex-1 p-10">
        <header className="flex justify-between items-center mb-12 text-right">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">نظرة عامة</h1>
            <p className="text-gray-500 mt-1">مرحباً بك، سيد سليمان. إليك آخر مستجدات العمل اليوم.</p>
          </div>
          {/* ... باقي جزء الـ Header كما هو في كودك ... */}
        </header>
        {/* ... باقي الإحصائيات والوحدات كما هي في كودك ... */}
      </main>
    </div>
  );
}