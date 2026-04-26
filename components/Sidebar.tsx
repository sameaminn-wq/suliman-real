'use client';
import { LayoutDashboard, Home, Users, PlusCircle, Settings, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

// هنا نحدد الأدوار: ADMIN (المدير), SECRETARY (السكرتارية), EMPLOYEE (الموظف)
export default function Sidebar({ role = 'ADMIN' }) {
  const menuItems = [
    { name: 'الإحصائيات', icon: LayoutDashboard, path: '/dashboard', access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] },
    { name: 'إضافة وحدة', icon: PlusCircle, path: '/dashboard/add-property', access: ['ADMIN', 'SECRETARY'] },
    { name: 'إدارة العقارات', icon: Home, path: '/gallery', access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] },
    { name: 'العملاء (Leads)', icon: Users, path: '/dashboard/customers', access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] },
    { name: 'إدارة الموظفين', icon: Shield, path: '/admin/staff', access: ['ADMIN'] },
  ];

  return (
    <div className="w-72 bg-[#0F172A] min-h-screen text-white p-6 flex flex-col fixed right-0 top-0 border-l border-white/5">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-[#10B981] rounded-lg"></div>
        <span className="text-xl font-bold tracking-tight">سليمان <span className="text-[#10B981]">PRO</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          item.access.includes(role) && (
            <Link key={item.path} href={item.path} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-gray-400 hover:text-white group">
              <item.icon size={22} className="group-hover:text-[#10B981] transition-colors" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6">
        <button className="flex items-center gap-4 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={22} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}