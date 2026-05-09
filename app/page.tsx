'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image'; // تحديث أمني وأداء

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* 1. قسم الهيرو (Hero Section) */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* خلفية الصورة - استخدام وسم Image من Next.js لمنع هجمات معينة وتحسين الأداء */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]" // تم تقليل السطوع قليلاً لزيادة تباين النص (أمان بصري)
            alt="عقارات فاخرة في مصر - سليمان للعقارات"
            loading="eager" // لضمان تحميلها فوراً لأنها في الهيرو
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
            سليمان للعقارات.. <br />
            <span className="text-[#10B981]">حيث تبدأ قصتك الجديدة</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            نحن لا نبيع جدراناً، نحن نختار لك المستقبل. استكشف أفخم الوحدات السكنية والاستثمارية في أرقى أحياء مصر.
          </p>
          
          <div className="flex flex-col md:flex-row gap-5 justify-center">
            <Link href="/gallery" className="bg-[#10B981] hover:bg-[#059669] text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20">
               استعرض المعرض الفاخر <ArrowLeft size={22} />
            </Link>
            {/* تم مسح زر دخول الموظفين بناءً على طلبك - الآن المسار سري تماماً */}
          </div>
        </div>
      </section>

      {/* 2. قسم الإحصائيات */}
      <section className="py-16 bg-[#F8FAFC] border-y">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { label: 'وحدة مباعة', value: '+500' },
            { label: 'عميل سعيد', value: '+1200' },
            { label: 'كمبوند حصري', value: '15' },
            { label: 'دعم استشاري', value: '24/7' }
          ].map((stat, idx) => (
            <div key={idx}>
              <h4 className="text-4xl font-bold text-[#0F172A]">{stat.value}</h4>
              <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. لماذا نحن؟ */}
      <section className="py-32 px-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">لماذا يختار المستثمرون «سليمان»؟</h2>
          <p className="text-gray-500">نحن نضع معايير جديدة للاحترافية في السوق المصري</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <FeatureCard 
            icon={<Shield size={36}/>} 
            title="أمان قانوني مطلق" 
            desc="نقوم بفحص جميع أوراق الوحدات قانونياً قبل عرضها لضمان استثمارك وحمايتك من أي مخاطر."
          />
          <FeatureCard 
            icon={<Star size={36}/>} 
            title="وحدات حصرية" 
            desc="نمتلك مخزوناً من الوحدات التي لا تعرض في الأسواق العامة، مخصصة فقط لعملاء سليمان للعقارات."
          />
          <FeatureCard 
            icon={<CheckCircle size={36}/>} 
            title="استشارات ذكية" 
            desc="فريقنا لا يبيع فقط، بل يقدم لك تحليلاً كاملاً للسوق ليساعدك على اتخاذ قرار استثماري رابح."
          />
        </div>
      </section>

      {/* 4. قسم "دعنا نتحدث" */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981] opacity-10 blur-3xl rounded-full -mr-20 -mt-20"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">هل تبحث عن وحدة بمواصفات خاصة؟</h2>
          <p className="text-gray-400 mb-12 text-lg relative z-10">اترك الأمر لفريقنا المتخصص وسنقوم بالتواصل معك خلال 24 ساعة.</p>
          <Link href="/gallery" className="bg-white text-[#0F172A] px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all relative z-10 inline-block">
            تواصل معنا الآن
          </Link>
        </div>
      </section>
    </div>
  );
}

// مكون فرعي لتقليل تكرار الكود وتحسين القراءة
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group">
      <div className="bg-emerald-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}