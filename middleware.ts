import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. جلب الجلسة (Session) بدلاً من المستخدم فقط، لأن الجلسة أسرع في التحديث
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/same-2090'

  // 2. تعديل شرط الطرد: 
  // إذا لم يجد مستخدم وكان يحاول دخول الداشبورد، نتحقق مرة أخرى من الكوكيز الخام في الطلب
  // كحماية إضافية ضد أخطاء التزامن (Race Condition)
  if (!user && (isDashboard || isAdmin)) {
    const hasSessionCookie = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token')
    
    // إذا لم يجد مستخدم فعلي ولا يوجد حتى كوكيز أولية، هنا فقط نقوم بالطرد
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL('/same-2090', request.url))
    }
  }

  // إذا كان مسجل دخول ويحاول الذهاب لصفحة تسجيل الدخول مرة أخرى
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}