import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // إنشاء استجابة أولية
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // تحديث الكوكيز في الطلب والاستجابة معاً لضمان التزامن
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // التحقق من الجلسة (getUser هي الطريقة الآمنة برمجياً)
  const { data: { user } } = await supabase.auth.getUser();

  const loginPath = '/same-2090';
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // 1. إذا كان المستخدم غير مسجل ويحاول دخول لوحة التحكم -> توجيه لصفحة الدخول
  if (!user && (isDashboardPath || isAdminPath)) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    return NextResponse.redirect(url);
  }

  // 2. إذا كان المستخدم مسجل ويحاول دخول صفحة الدخول -> توجيه للداشبورد (منع تكرار الدخول)
  if (user && request.nextUrl.pathname === loginPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

// تحديد المسارات التي يراقبها الـ Middleware
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/same-2090' // مراقبة صفحة الدخول أيضاً
  ],
};