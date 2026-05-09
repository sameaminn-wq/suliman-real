'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Home, Users, TrendingUp, Menu, X } from 'lucide-react';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = [
    { title: 'إجمالي المبيعات', value: '45,200,000 ج.م', icon: DollarSign, color: 'bg-blue-500' },
    { title: 'الوحدات المتاحة', value: '128', icon: Home, color: 'bg-[#10B981]' },
    { title: 'العملاء النشطين', value: '1,420', icon: Users, color: 'bg-purple-500' },
    { title: 'نسبة النمو', value: '+18%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative">
      
      {/* Sidebar - يظهر بشكل ثابت في الشاشات الكبيرة وكمنبثق في الصغير */}
      <div className={`
        fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex-none
      `}>
        <Sidebar role="ADMIN" />
      </div>

      {/* Overlay للموبايل عند فتح السايد بار */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 w-full p-4 md:p-10 overflow-hidden">
        
        {/* Header متجاوب */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-12">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A]">نظرة عامة</h1>
              <p className="text-gray-500 mt-1 text-sm">مرحباً بك، سيد سليمان.</p>
            </div>
            
            {/* زر فتح القائمة للموبايل فقط */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-[#0F172A]"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl border border-gray-50 shadow-sm self-end md:self-auto">
            <div className="text-left">
              <p className="text-sm font-bold text-[#0F172A]">سليمان العزومي</p>
              <p className="text-[10px] text-[#10B981] font-bold">المدير التنفيذي</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
               <img src="https://ui-avatars.com/api/?name=Soliman&background=10B981&color=fff" alt="User" />
            </div>
          </div>
        </header>

        {/* شبكة الإحصائيات - توزيع مرن */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className={`${s.color} w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
              <s.icon size={24} className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <p className="text-gray-400 text-xs md:text-sm font-medium">{s.title}</p>
              <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mt-1 break-words">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* الوحدات الأخيرة - تحسين العرض في الموبايل */}
        <div className="mt-8 md:mt-12 bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-gray-100 shadow-sm overflow-hidden">
          <h2 className="text-lg md:text-xl font-bold mb-6 text-[#0F172A]">أحدث الوحدات في السوق</h2>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=100`} alt="prop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F172A] text-sm md:text-base">بنتهاوس زايد الجديدة</p>
                    <p className="text-[10px] md:text-xs text-gray-400">منذ ساعتين • بواسطة محمد</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                  <p className="font-bold text-[#10B981] text-sm md:text-base">8,200,000 ج.م</p>
                  <p className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold mt-1">نشط</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
