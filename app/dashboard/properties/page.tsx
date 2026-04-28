// حذف 'use client' لأننا سنعمل الآن على السيرفر
import { createClient } from '@/lib/supabase/server'; // استخدام نسخة السيرفر
import Sidebar from '@/components/Sidebar';
import { MapPin, Building2, User } from 'lucide-react';

// تعريف الأنواع (Interface)
interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image_url: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export default async function PropertiesPage() {
  const supabase = await createClient();

  // جلب البيانات مباشرة من السيرفر مع ربط اسم "المعدل" من جدول البروفايلات
  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id, 
      title, 
      location, 
      price, 
      image_url, 
      created_at,
      profiles:created_by (
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">محفظة العقارات</h1>
          <p className="text-gray-500">عرض وإدارة المحفظة العقارية الحالية</p>
        </header>

        {error ? (
          <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-red-700 font-bold">
            خطأ في جلب البيانات: {error.message}
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-bold">لا توجد عقارات مضافة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop: Property) => (
              <div 
                key={prop.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={prop.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur shadow-lg px-4 py-1.5 rounded-2xl text-sm font-black text-[#10B981]">
                    {prop.price?.toLocaleString('ar-EG') ?? '0'} ج.م
                  </div>
                </div>
                
                <div className="p-7">
                  <h3 className="font-black text-xl text-[#0F172A] mb-3 group-hover:text-[#10B981] transition-colors">
                    {prop.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin size={16} className="text-[#10B981]" />
                    <span className="text-sm font-medium">{prop.location}</span>
                  </div>

                  {/* قسم المعدل: يظهر اسم الموظف الذي أضاف العقار */}
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={14} className="text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold">بواسطة</span>
                        <span className="text-xs font-black text-[#0F172A]">
                          {prop.profiles?.full_name || 'مسؤول النظام'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 ltr">
                      {new Date(prop.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}