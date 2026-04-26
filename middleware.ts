import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
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
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // جلب الجلسة الحالية للتأكد من هوية المستخدم
  const { data: { session } } = await supabase.auth.getSession();

  const secretPath = '/same-2090';

  // 1. حماية لوحة التحكم: إذا حاول شخص دخول /dashboard وهو غير مسجل
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL(secretPath, request.url));
  }

  // 2. حماية صفحة الإدارة: إذا حاول شخص دخول /admin وهو غير مسجل
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL(secretPath, request.url));
  }

  return response;
}

export const config = {
  // المسارات التي يراقبها الحارس (Middleware)
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};