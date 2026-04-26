'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; // تأكد من المسار الصحيح
import { useRouter } from 'next/navigation';

// تأكد من وجود كلمة default هنا
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('خطأ في الدخول: ' + error.message);
      setLoading(false);
    } else {
      // بدلاً من router.push
      window.location.href = '/dashboard'; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-[#0F172A] mb-8">سليمان <span className="text-[#10B981]">للعقارات</span></h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 mr-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right"
              placeholder="mail@soliman.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 mr-1">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-right"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1E293B] transition-all disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}