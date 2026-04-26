'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, Maximize, BedDouble, Bath, 
  CheckCircle2, MessageCircle, Phone, 
  Loader2, ArrowRight, Eye 
} from 'lucide-react';
import Link from 'next/link';

// تعريف النوع لضمان سلامة البيانات
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  rooms: number;
  bathrooms: number;
  type: string;
  image_url?: string;
  views: number;
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // 1. جلب بيانات العقار
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProperty(data);

        // 2. تحديث عدد المشاهدات بشكل منفصل ومنظم
        await supabase
          .from('properties')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropertyData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#10B981] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">جاري تحضير عرض الوحدة...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">عذراً، لم يتم العثور على العقار</h2>
        <Link href="/gallery" className="text-[#10B981] font-bold flex items-center gap-2 hover:underline">
          <ArrowRight size={20} /> العودة للمعرض
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans" dir="rtl">
      {/* الهيدر التفاعلي (Hero Section) */}
      <div className="h-[70vh] w-full relative overflow-hidden">
        <img 
          src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
          className="w-full h-full object-cover transform scale-105"
          alt={property.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/20"></div>
        
        <div className="absolute bottom-12 right-12 left-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#10B981] px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
              {property.type}
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <Eye size={14} /> {property.views || 0} مشاهدة
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight max-w-4xl">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-lg">
            <MapPin size={20} className="text-[#10B981]" />
            {property.location}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16">
        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-2">
          <section className="mb-12">
            <h2 className="text-2xl font-black text-[#0F172A] mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-[#10B981] rounded-full"></div>
              تفاصيل العقار
            </h2>
            <p className="text-gray-600 leading-[2] text-lg text-justify whitespace-pre-line">
              {property.description || 'وصف العقار غير متوفر حالياً. تواصل معنا للحصول على كامل المعلومات الفنية والمميزات.'}
            </p>
          </section>

          {/* شبكة المواصفات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="text-center group">
              <Maximize className="mx-auto text-[#10B981] mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="text-gray-400 text-xs mb-1">المساحة الكلية</p>
              <p className="font-black text-xl text-[#0F172A]">{property.area} <span className="text-sm font-normal">م²</span></p>
            </div>
            <div className="text-center border-r border-gray-200/50 group">
              <BedDouble className="mx-auto text-[#10B981] mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="text-gray-400 text-xs mb-1">عدد الغرف</p>
              <p className="font-black text-xl text-[#0F172A]">{property.rooms}</p>
            </div>
            <div className="text-center border-r border-gray-200/50 group">
              <Bath className="mx-auto text-[#10B981] mb-3 group-hover:scale-110 transition-transform" size={28} />
              <p className="text-gray-400 text-xs mb-1">حمامات</p>
              <p className="font-black text-xl text-[#0F172A]">{property.bathrooms}</p>
            </div>
            <div className="text-center border-r border-gray-200/50 group">
              <div className="text-[#10B981] text-2xl font-black mb-3">L.E</div>
              <p className="text-gray-400 text-xs mb-1">السعر المطلوب</p>
              <p className="font-black text-xl text-[#10B981]">
                {Number(property.price).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* كارت التواصل الذكي */}
        <div className="lg:col-span-1">
          <div className="bg-[#0F172A] p-10 rounded-[3rem] sticky top-10 shadow-2xl shadow-[#0F172A]/20 transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">مهتم بالمعاينة؟</h3>
            <p className="text-gray-400 text-center text-sm mb-10">سليمان وفريقه متاحون للإجابة على استفساراتك فوراً</p>
            
            <div className="space-y-4">
              <a 
                href={`https://wa.me/+201156383133?text=مرحباً، أريد الاستفسار عن عقار: ${property.title}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-3 bg-[#10B981] text-white py-5 rounded-[1.5rem] font-bold hover:bg-[#0da06f] transition-all"
              >
                <MessageCircle size={22} />
                تحدث معنا (واتساب)
              </a>
              
              <a 
                href="tel:+201156383133"
                className="w-full flex items-center justify-center gap-3 bg-white/5 text-white py-5 rounded-[1.5rem] font-bold hover:bg-white/10 transition-all border border-white/10"
              >
                <Phone size={22} />
                اتصال هاتفي سريع
              </a>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={14} className="text-[#10B981]" />
                </div>
                متاح للمعاينة طوال الأسبوع
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={14} className="text-[#10B981]" />
                </div>
                تسجيل ملكية مباشر
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}