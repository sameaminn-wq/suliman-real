'use client';

import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  LogOut, 
  Shield, 
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { signOutAction } from '@/app/actions/auth';

// تعريف الأنواع بدقة
type Role = 'ADMIN' | 'SECRETARY' | 'EMPLOYEE';

interface SidebarProps {
  role: Role; // إزالة الـ '?' لجعل الدور إجبارياً من الأب
}

const menuItems = [
  { 
    name: 'الإحصائيات', 
    icon: LayoutDashboard, 
    path: '/dashboard', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'إدارة العقارات', 
    icon: Building2, 
    path: '/dashboard/properties', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'إضافة وحدة', 
    icon: PlusCircle, 
    path: '/dashboard/add-property', 
    access: ['ADMIN', 'SECRETARY'] 
  },
  { 
    name: 'العملاء (Leads)', 
    icon: Users, 
    path: '/dashboard/customers', 
    access: ['ADMIN', 'SECRETARY', 'EMPLOYEE'] 
  },
  { 
    name: 'إدارة الموظفين', 
    icon: Shield, 
    path: '/admin/staff', 
    access: ['ADMIN'] 
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const loadingToast = toast.loading('جاري تسجيل الخروج آمنياً...');
    try {
      await signOutAction();
      toast.success('تم تسجيل الخروج بنجاح', { id: loadingToast });
    } catch (error: any) {
      toast.error('حدث خطأ أثناء محاولة الخروج', { id: loadingToast });
    }
  };

  return (
    <div className="w-72 bg-[#0F172A] min-h-screen text-white p-6 flex flex-col fixed right-0 top-0 border-l border-white/5 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center shadow-lg shadow-[#10B981]/20">
          <Building2 size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          سليمان <span className="text-[#10B981]">PRO</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          // التحقق الصارم من الصلاحية
          const hasAccess = item.access.includes(role);

          if (!hasAccess) return null;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`
                flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/10' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon 
                size={22} 
                className={`${isActive ? 'text-white' : 'group-hover:text-[#10B981]'} transition-colors`} 
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6">
        <div className="mb-4 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
          <p className="text-xs text-gray-500 mb-1">دخول بصلاحية:</p>
          <p className="text-sm font-semibold text-[#10B981]">{role}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}