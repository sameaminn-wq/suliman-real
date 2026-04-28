'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, Maximize, BedDouble, Bath, 
  CheckCircle2, MessageCircle, Phone, 
  Loader2, ArrowRight, Eye, Share2, Heart,
  Info
} from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

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
  
  // استخدام Ref لمنع تكرار زيادة المشاهدات في حالة إعادة الصيرورة (Re-render)
  const viewIncremented = useRef(false);

  const fetchPropertyData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProperty(data);

      // تحديث المشاهدات: يتم مرة واحدة فقط لكل تحميل صفحة باستخدام useRef
      if (!viewIncremented.current) {
        supabase.rpc('increment_views', { property_id: id }).then(({ error }) => {
          if (error) console.error('View Update Failed:', error);
          else viewIncremented.current = true;
        });
      }

    } catch (error: any) {
      console.error('Error:', error.message);
      toast.error('تعذر تحميل بيانات الوحدة');
    } finally {
      setLoading(false);
    }
  }, [id]); // الاعتماد على id فقط لضمان جلب البيانات عند تغير الرابط

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  const handleShare = () => {
    const shareData = {
      title: property?.title || 'سليمان للعقارات',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('تم نسخ الرابط لمشاركته');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
          <Loader2 className="w-8 h-8 text-[#10B981] animate-pulse" />
        </div>
        <p className="mt-8 text-gray-500 font-bold tracking-widest animate-pulse">جاري تحضير تجربة العرض...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Info className="text-red-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-[#0F172A] mb-4">عذراً، لم يتم العثور على العقار</h2>
        <Link href="/gallery" className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[#1E293B] transition-all">
          <ArrowRight size={20} /> العودة لمعرض العقارات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans" dir="rtl">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <div className="h-[75vh] w-full relative overflow-hidden group">
        <img 
          src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070'} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          alt={property.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-black/40"></div>
        
        <div className="absolute top-8 left-8 flex gap-3">
          <button onClick={handleShare} className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10">
            <Share2 size={20} />
          </button>
          <button className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-red-500 transition-all border border-white/10">
            <Heart size={20} />
          </button>
        </div>

        <div className="absolute bottom-16 right-10 left-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#10B981] px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
              {property.type}
            </span>
            <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border border-white/5">
              <Eye size={16} className="text-[#10B981]" /> {property.views || 0} مشاهدة
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] max-w-5xl">
            {property.title}
          </h1>
          <div className="flex items-center gap-3 text-white/90 text-xl font-medium">
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center">
              <MapPin size={22} className="text-white" />
            </div>
            {property.location}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-20">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-3xl font-black text-[#0F172A] mb-8 flex items-center gap-4">
              <span className="w-3 h-10 bg-[#10B981] rounded-full inline-block"></span>
              نظرة عامة على العقار
            </h2>
            <div className="bg-[#F8FAFC] p-10 rounded-[3rem] border border-gray-50 leading-[2.2] text-gray-600 text-lg whitespace-pre-line">
              {property.description}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-[#0F172A] mb-8">المواصفات الفنية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Maximize size={32} />, label: 'المساحة', value: `${property.area} م²` },
                { icon: <BedDouble size={32} />, label: 'الغرف', value: property.rooms },
                { icon: <Bath size={32} />, label: 'الحمامات', value: property.bathrooms },
                { icon: <div className="text-[#10B981] font-black text-2xl tracking-tighter">L.E</div>, label: 'السعر', value: Number(property.price).toLocaleString() }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center group">
                  <div className="text-[#10B981] mb-4 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                  <p className="text-gray-400 text-xs font-bold mb-1 uppercase">{item.label}</p>
                  <p className="font-black text-2xl text-[#0F172A]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#0F172A] p-12 rounded-[3.5rem] sticky top-10 shadow-2xl">
            <h3 className="text-3xl font-black text-white mb-4 text-center">احجز موعد المعاينة</h3>
            <div className="space-y-5">
              <a 
                href={`https://wa.me/+201156383133?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن عقار: ${property.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-4 bg-[#10B981] text-white py-6 rounded-[2rem] font-black text-lg hover:bg-[#0da06f] transition-all shadow-xl shadow-emerald-500/20"
              >
                <MessageCircle size={26} />
                واتساب مباشر
              </a>
              <a href="tel:+201156383133" className="w-full flex items-center justify-center gap-4 bg-white/5 text-white py-6 rounded-[2rem] font-black text-lg border border-white/10">
                <Phone size={26} />
                اتصال سريع
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}