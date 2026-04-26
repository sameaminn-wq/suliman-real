import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Home, Users, TrendingUp, Building2, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. الحماية: التأكد من وجود جلسة دخول (Session)
  const { data: { session } } = await supabase.auth.getSession();

  // إذا لم يكن مسجلاً، يتم طرده للرابط السري
  if (!session) {
    redirect('/same-2090');
  }

  // 2. جلب بيانات حقيقية من قاعدة البيانات
  // جلب إجمالي عدد العقارات
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  // جلب آخر 3 عقارات مضافة لعرضها في الجدول
  const { data: recentProperties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  const stats = [
    { title: 'إجمالي المبيعات (تقديري)', value: '45,200,000 ج.م', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'الوحدات المتاحة حالياً', value: totalProperties?.toString() || '0', icon: Home, color: 'bg-[#10B981]' },
    { title: 'طلبات المعاينة', value: '12', icon: Users, color: 'bg-purple-500' },
    { title: 'نسبة النمو', value: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* القائمة الجانبية */}
      <Sidebar role="ADMIN" />

      <main className="mr-72 flex-1 p-10">
        {/* الهيدر */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">لوحة التحكم</h1>
            <p className="text-gray-500 mt-1">مرحباً بك، سيد سليمان. إليك نظرة سريعة على أعمالك اليوم.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#0F172A]">سليمان العزومي</p>
              <p className="text-xs text-[#10B981]">المدير التنفيذي</p>
            </div>
          </div>
        </header>

        {/* شبكة الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{s.title}</p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* عرض الوحدات الأخيرة المضافة */}
        <div className="mt-12 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <Building2 className="text-[#10B981]" />
              أحدث الوحدات المضافة
            </h2>
            <button className="text-[#10B981] text-sm font-bold hover:underline">عرض الكل</button>
          </div>

          <div className="space-y-4">
            {recentProperties?.map((prop) => (
              <div key={prop.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                    <img src={prop.image_url} alt={prop.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">{prop.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Clock size={12} />
                      <span>{new Date(prop.created_at).toLocaleDateString('ar-EG')}</span>
                      <span>•</span>
                      <span>{prop.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#10B981]">{Number(prop.price).toLocaleString()} ج.م</p>
                  <p className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full inline-block mt-1">نشط في المعرض</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}