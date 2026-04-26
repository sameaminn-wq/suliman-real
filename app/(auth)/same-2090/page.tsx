'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast'; // استيراد المكتبة

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // التحقق المبدئي
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // تنظيف البريد من المسافات
        password: password,
      });

      if (error) {
        // رسائل خطأ ذكية بناءً على نوع الخطأ
        if (error.message.includes('Invalid login credentials')) {
          toast.error('خطأ في البيانات: تأكد من البريد أو كلمة المرور');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      } else {
        toast.success('تم تسجيل الدخول بنجاح! جاري التوجيه...');
        
        // تأخير بسيط ليتمكن المستخدم من رؤية رسالة النجاح
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); 
        }, 1000);
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع في الاتصال');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      {/* مكون الإشعارات يجب أن يكون موجوداً في الصفحة */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black text-center text-[#0F172A] mb-8">
          سليمان <span className="text-[#10B981]">للعقارات</span>
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
          <div className="space-y-2">
            <label className="block text-sm font-black mr-1 text-gray-700">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right font-medium"
              placeholder="mail@soliman.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-black mr-1 text-gray-700">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`
              w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-gray-200'}
            `}
          >
            {loading ? 'جاري التحقق من الهوية...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}