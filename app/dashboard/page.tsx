import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase/server'; // استيراد نسخة السيرفر
import { redirect } from 'next/navigation';
import { DollarSign, Home, Users, TrendingUp } from 'lucide-react';

// إجبار الصفحة على التحديث دائمًا لقراءة الكوكيز الجديدة
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // 1. إنشاء العميل والتحقق من المستخدم (هنا يتم استخدام cookies() بنجاح)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. حماية الصفحة: إذا لم يجد مستخدم، يوجهه فوراً لصفحة الدخول
  if (!user) {
    redirect('/login');
  }

  // بيانات محاكية (يمكنك مستقبلاً جلبها من Supabase هنا باستخدام supabase.from('...'))
  const stats = [
    { title: 'إجمالي المبيعات', value: '45,200,000 ج.م', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'الوحدات المتاحة', value: '128', icon: Home, color: 'bg-[#10B981]' },
    { title: 'العملاء النشطين', value: '1,420', icon: Users, color: 'bg-purple-500' },
    { title: 'نسبة النمو', value: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* تمرير بيانات المستخدم للسايدبار إذا كنت بحاجة لعرض اسمه هناك */}
      <Sidebar role="ADMIN" user={user} />
      
      <main className="mr-72 flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">نظرة عامة</h1>
            <p className="text-gray-500 mt-1">مرحباً بك، سيد سليمان. إليك آخر مستجدات العمل اليوم.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left ml-4">
              <p className="text-sm font-bold text-[#0F172A]">{user.email?.split('@')[0] || 'سليمان العزومي'}</p>
              <p className="text-xs text-[#10B981]">المدير التنفيذي</p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.email}&background=10B981&color=fff`} alt="User" />
            </div>
          </div>
        </header>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-gray-100`}>
                <s.icon size={24} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{s.title}</p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* الوحدات الأخيرة المضافة */}
        <div className="mt-12 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-8 text-[#0F172A]">أحدث الوحدات في السوق</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=100`} alt="prop" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A]">بنتهاوس زايد الجديدة</p>
                    <p className="text-xs text-gray-400">منذ ساعتين • بواسطة محمد (سكرتارية)</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#10B981]">8,200,000 ج.م</p>
                  <p className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full inline-block mt-1">نشط</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}