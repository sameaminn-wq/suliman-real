"use client"; // نحتاج هذا لأننا سنستخدم useState للقائمة

import { useState } from 'react';
import './globals.css';
import { Cairo } from 'next/font/google';
import { MessageCircle, Menu, X } from 'lucide-react';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappNumber = "+201156383133";

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-[#F8FAFC] text-[#1E293B] antialiased`}>
        
        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-[100] px-4 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-100">س</div>
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-[#0F172A]">
                سليمان <span className="text-[#10B981]">للعقارات</span>
              </span>
            </div>
            
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8 font-bold text-sm text-[#0F172A]">
                <a href="/" className="hover:text-[#10B981] transition-colors">الرئيسية</a>
                <a href="/gallery" className="hover:text-[#10B981] transition-colors">المعرض</a>
                <a href="#" className="hover:text-[#10B981] transition-colors">عن الشركة</a>
              </div>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#059669] transition-all shadow-md shadow-emerald-100"
              >
                <MessageCircle size={18} />
                تواصل معنا
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#0F172A]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-4 font-bold text-lg">
                <a href="/" onClick={() => setIsMenuOpen(false)}>الرئيسية</a>
                <a href="/gallery" onClick={() => setIsMenuOpen(false)}>المعرض</a>
                <a href="#" onClick={() => setIsMenuOpen(false)}>عن الشركة</a>
              </div>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#10B981] text-white py-4 rounded-2xl font-bold text-lg"
              >
                <MessageCircle size={22} />
                تواصل واتساب
              </a>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400 text-sm font-medium">
              © 2026 سليمان للاستثمار والتسويق العقاري. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}