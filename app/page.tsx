'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Star, CheckCircle } from 'lucide-react';

/**
 * LandingPage - سليمان للعقارات
 * تم تصحيح معالجة الأحرف الخاصة وتأمين الروابط الخارجية.
 */
export default function LandingPage() {
  // رقم الواتساب الخاص بك بالتنسيق الدولي الصحيح
  const whatsappNumber = "201156383133";
  const message = encodeURIComponent("مرحباً سليمان للعقارات، أريد الاستفسار عن الوحدات المتاحة لديك.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="bg-white" dir="rtl">
      {/* 1. قسم الهيرو (Hero Section) */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]" 
            alt="عقارات فاخرة في مصر - سليمان للعقارات"
            loading="eager"
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
            <Link 
              href="/gallery" 
              className="bg-[#10B981] hover:bg-[#059669] text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
            >
               استعرض المعرض الفاخر <ArrowLeft size={22} />
            </Link>
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
          <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
            لماذا يختار المستثمرون &quot;سليمان&quot;؟
          </h2>
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

      {/* 4. قسم التواصل */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981] opacity-10 blur-3xl rounded-full -mr-20 -mt-20"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">
            هل تبحث عن وحدة بمواصفات خاصة؟
          </h2>
          <p className="text-gray-400 mb-12 text-lg relative z-10">
            تحدث معنا مباشرة عبر الواتساب، وسيقوم مستشارك العقاري بالرد عليك فوراً.
          </p>
          
          <a 
            href={whatsappUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-[#128C7E] transition-all transform hover:scale-105 relative z-10 inline-flex items-center gap-3 shadow-xl shadow-green-900/20"
          >
            <WhatsAppIcon />
            تواصل معنا عبر واتساب
          </a>
        </div>
      </section>
    </div>
  );
}

// مكون فرعي للبطاقات لتحسين الأداء والقراءة
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

// أيقونة الواتساب مفصولة لتبسيط الكود الأساسي
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.554 4.197 1.606 6.02L0 24l6.136-1.61a11.77 11.77 0 005.911 1.586h.005c6.632 0 12.046-5.414 12.046-12.05 0-3.217-1.251-6.242-3.522-8.513z"/>
    </svg>
  );
}