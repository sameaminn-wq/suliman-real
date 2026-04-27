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
import { usePathname, useRouter } from 'next/navigation'; // أضفنا useRouter
import { supabase } from '@/lib/supabase'; // تأكد من مسار السوبا بيس لديك
import toast from 'react-hot-toast';

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

export default function Sidebar({ role = 'ADMIN' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); // لتمكين التنقل البرمجي

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('تم تسجيل الخروج بنجاح');
      
      // توجيه المستخدم لصفحة تسجيل الدخول
      router.push('/login'); 
      router.refresh(); // لضمان مسح أي بيانات مخزنة في الكاش
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
      console.error(error.message);
    }
  };

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

      {/* Footer Section */}
      <div className="mt-auto border-t border-white/5 pt-6">
        <button 
          onClick={handleLogout} // ربط الدالة هنا
          className="flex items-center gap-4 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}