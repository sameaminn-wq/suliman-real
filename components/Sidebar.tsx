'use client';

import { 
  LayoutDashboard, 
  Home, 
  Users, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Shield, 
  Building2,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// تعريف أنواع الأدوار لضمان دقة النوع (Type Safety)
type Role = 'ADMIN' | 'SECRETARY' | 'EMPLOYEE';

interface SidebarProps {
  role?: Role;
}

const menuItems = [
  { 
    name: 'الإحصائيات', 
    icon: LayoutDashboard, 
    path: '/dashboard', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'إضافة وحدة', 
    icon: PlusCircle, 
    path: '/dashboard/properties/new', 
    access: ['ADMIN', 'SECRETARY'] 
  },
  { 
    name: 'إدارة العقارات', 
    icon: Building2, 
    path: '/dashboard/properties', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'العملاء (Leads)', 
    icon: Users, 
    path: '/dashboard/customers', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'الرسائل', 
    icon: Mail, 
    path: '/dashboard/messages', 
    access: ['ADMIN', 'SECRETARY'] 
  },
  { 
    name: 'إدارة الموظفين', 
    icon: Shield, 
    path: '/admin/staff', 
    access: ['ADMIN'] 
  },
];

export default function Sidebar({ role = 'ADMIN' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-[#0F172A] min-h-screen text-white p-6 flex flex-col fixed right-0 top-0 border-l border-white/5 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10B981]/20">
          <Building2 size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          سليمان <span className="text-[#10B981]">PRO</span>
        </span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const hasAccess = item.access.includes(role);

          if (!hasAccess) return null;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#10B981]/10 text-[#10B981]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon 
                size={22} 
                className={`${isActive ? 'text-[#10B981]' : 'group-hover:text-[#10B981]'} transition-colors`} 
              />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="mr-auto w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto border-t border-white/5 pt-6 space-y-2">
        <Link 
          href="/dashboard/settings" 
          className="flex items-center gap-4 p-4 text-gray-400 hover:bg-white/5 rounded-2xl transition-all"
        >
          <Settings size={22} />
          <span className="font-medium">الإعدادات</span>
        </Link>
        
        <button 
          onClick={() => {/* أضف منطق تسجيل الخروج هنا */}}
          className="flex items-center gap-4 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}