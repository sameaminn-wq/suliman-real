'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react'; // أيقونات إضافية للجماليات

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // فحص حالة الإنترنت
  const router = useRouter();

  // فحص حالة الإنترنت عند فتح الصفحة
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      alert('⚠️ أنت لست متصلاً بالإنترنت حالياً. تسجيل دخول الموظفين يتطلب اتصالاً سحابياً.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('❌ خطأ في الدخول: ' + error.message);
        setLoading(false);
      } else if (data.user) {
        // حفظ جلسة الموظف في المخزن المحلي للديسك توب لسرعة الفتح لاحقاً
        localStorage.setItem('last_login', new Date().toISOString());
        window.location.href = '/dashboard'; 
      }
    } catch (err) {
      alert('حدث خطأ غير متوقع، حاول مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100 relative overflow-hidden">
        
        {/* شريط تنبيه في حالة عدم وجود إنترنت */}
        {!isOnline && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[10px] py-1 text-center font-bold flex items-center justify-center gap-1">
            <AlertCircle size={10} /> وضع العمل بدون اتصال مفعل (للمعرض فقط)
          </div>
        )}

        <h1 className="text-3xl font-bold text-center text-[#0F172A] mb-2 mt-4">
          سليمان <span className="text-[#10B981]">للعقارات</span>
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">لوحة تحكم الموظفين والمديرين</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold mb-2 mr-1 text-right">البريد الإلكتروني</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right"
                placeholder="mail@soliman.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 mr-1 text-right">كلمة المرور</label>
            <div className="relative">
              <input 
                type="password" 
                className="w-full p-4 pr-12 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1E293B] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحقق...
              </>
            ) : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          نسيت كلمة المرور؟ تواصل مع المدير التقني
        </p>
      </div>
    </div>
  );
}