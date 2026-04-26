'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { 
  Building2, MapPin, ImageIcon, 
  Loader2, Save, AlignRight, 
  CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    rooms: '',
    bathrooms: '',
    type: 'شقة',
    description: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // تنظيف البيانات وتحويلها لأنواعها الصحيحة أمنياً
      const cleanData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        rooms: parseInt(formData.rooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        type: formData.type,
        description: formData.description.trim(),
        image_url: formData.image_url.trim() || null,
        status: 'available', // حالة افتراضية آمنة
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('properties')
        .insert([cleanData]);

      if (error) throw error;

      setSuccess(true);
      // تأخير بسيط لإظهار رسالة النجاح ثم التحويل
      setTimeout(() => {
        router.push('/dashboard/add-properties');
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error('Submission Error:', error.message);
      alert('حدث خطأ في النظام: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Sidebar role="ADMIN" />
      
      <main className="mr-72 flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">إضافة وحدة عقارية</h1>
              <p className="text-gray-500 mt-2 text-lg">أدخل البيانات الفنية للوحدة ليتم أرشفتها في النظام</p>
            </div>
            {success && (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl font-bold animate-bounce">
                <CheckCircle size={20} /> تم الحفظ بنجاح
              </div>
            )}
          </header>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50">
            
            {/* القسم الأول: المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">مسمى الوحدة</label>
                <div className="relative">
                  <Building2 className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    required
                    type="text"
                    placeholder="مثال: فيلا الياسمين - التجمع الخامس"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] outline-none transition-all font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">الموقع التفصيلي</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    required
                    type="text"
                    placeholder="المدينة، الحي، الشارع"
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] outline-none transition-all font-medium"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* القسم الثاني: البيانات الرقمية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'السعر (ج.م)', key: 'price', placeholder: '0.00' },
                { label: 'المساحة (م²)', key: 'area', placeholder: '0' },
                { label: 'غرف النوم', key: 'rooms', placeholder: '0' },
                { label: 'الحمامات', key: 'bathrooms', placeholder: '0' }
              ].map((item) => (
                <div key={item.key} className="space-y-3">
                  <label className="text-sm font-black text-[#0F172A] mr-1">{item.label}</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    placeholder={item.placeholder}
                    className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] font-bold text-[#10B981]" 
                    value={(formData as any)[item.key]}
                    onChange={(e) => setFormData({...formData, [item.key]: e.target.value})} 
                  />
                </div>
              ))}
            </div>

            {/* القسم الثالث: النوع والوسائط */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">نوع العقار</label>
                <select 
                  className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] font-medium appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="شقة">شقة سكنية</option>
                  <option value="فيلا">فيلا / قصر</option>
                  <option value="دوبلكس">دوبلكس</option>
                  <option value="محل تجاري">محل تجاري</option>
                  <option value="مكتب">مكتب إداري</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-[#0F172A] mr-1">رابط صورة المعرض الرئيسية</label>
                <div className="relative">
                  <ImageIcon className="absolute right-4 top-4 text-gray-300" size={20} />
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pr-12 pl-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981]"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* حقل الوصف المضاف */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0F172A] mr-1">وصف تفصيلي للوحدة</label>
              <div className="relative">
                <AlignRight className="absolute right-4 top-4 text-gray-300" size={20} />
                <textarea 
                  rows={4}
                  placeholder="اكتب مميزات العقار، التشطيب، والخدمات القريبة..."
                  className="w-full pr-12 pl-6 py-4 rounded-3xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all resize-none font-medium"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* زر الحفظ الإستراتيجي */}
            <button 
              disabled={loading || success}
              type="submit"
              className={`
                w-full py-5 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl
                ${success 
                  ? 'bg-emerald-500 text-white shadow-emerald-200' 
                  : 'bg-[#0F172A] text-white hover:bg-[#1e293b] shadow-gray-200'}
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : success ? (
                <><CheckCircle size={24}/> تم النشر بنجاح</>
              ) : (
                <><Save size={24}/> اعتماد ونشر الوحدة</>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}