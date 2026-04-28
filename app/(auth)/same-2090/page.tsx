'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    
    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      setLoading(false);
      return;
    }

    try {
      // محاولة تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), 
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('بيانات الدخول غير صحيحة، يرجى التحقق');
        } else {
          toast.error(error.message);
        }
        setLoading(false);
      } else if (data?.session) {
        // نجاح الدخول
        toast.success('تم التحقق.. جاري الدخول للوحة التحكم');

        // التعديل التقني هنا:
        // ننتظر 500ms لضمان استقرار الكوكيز في المتصفح والـ Middleware
        // ونستخدم window.location.assign لعمل إعادة تحميل كاملة تضمن وصول الكوكيز للسيرفر
        setTimeout(() => {
          window.location.assign('/dashboard');
        }, 500);
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع في الاتصال');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">
            سليمان <span className="text-[#10B981]">للعقارات</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">بوابة الإدارة الذكية</p>
        </div>
        
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
              ${loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-gray-200'}
            `}
          >
            {loading ? 'جاري التحقق من الهوية...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}