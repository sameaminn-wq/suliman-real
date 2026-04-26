import './globals.css';
import { Cairo } from 'next/font/google';
import { MessageCircle } from 'lucide-react';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'] });

export const metadata = {
  title: 'سليمان للعقارات | وجهتك الأولى للسكن الفاخر',
  description: 'نظام إدارة وعرض العقارات الأكثر تطوراً في مصر',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = "+201156383133";

  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-[#F8FAFC] text-[#1E293B]`}>
        
        {/* Navbar: شعار يمين - روابط وواتساب يسار */}
        <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-100">س</div>
            <span className="text-2xl font-bold tracking-tighter text-[#0F172A]">
              سليمان <span className="text-[#10B981]">للعقارات</span>
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 font-bold text-sm text-[#0F172A]">
              <a href="/" className="hover:text-[#10B981] transition-colors">الرئيسية</a>
              <a href="/gallery" className="hover:text-[#10B981] transition-colors">المعرض</a>
              <a href="#" className="hover:text-[#10B981] transition-colors">عن الشركة</a>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-200 mx-2"></div>
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#059669] transition-all shadow-md shadow-emerald-100"
            >
              <MessageCircle size={18} />
              تواصل معنا
            </a>
          </div>
        </nav>

        {children}

        {/* Footer نظيف تماماً للجمهور */}
        <footer className="bg-white border-t py-12 mt-20">
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