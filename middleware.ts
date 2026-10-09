import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isDemoMode } from '@/lib/features'

const LAST_ACCESS_KEY = 'vb_last_access'
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000

const AUTH_ROUTES = ['/login', '/signup']
// Acessíveis com ou sem sessão (o link de recuperação de senha cria a sessão nesta página)
const PUBLIC_ROUTES = ['/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isDemoMode) return demoMiddleware(request)

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getUser() — validates JWT server-side (getSession() não valida no servidor)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isApiRoute = pathname.startsWith('/api/')

  if (isApiRoute) {
    // API routes handle their own auth — just return with refreshed session cookies
    return response
  }

  if (PUBLIC_ROUTES.includes(pathname)) return response

  if (user) {
    // Check 15-day inactivity timeout
    const lastAccessStr = request.cookies.get(LAST_ACCESS_KEY)?.value
    if (lastAccessStr) {
      const lastAccess = Number(lastAccessStr)
      if (!isNaN(lastAccess) && Date.now() - lastAccess > FIFTEEN_DAYS_MS) {
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const redirectResponse = NextResponse.redirect(url)
        // Copy auth cookie deletions from signOut into the redirect response
        response.headers.getSetCookie().forEach((cookie) => {
          redirectResponse.headers.append('Set-Cookie', cookie)
        })
        redirectResponse.cookies.delete(LAST_ACCESS_KEY)
        return redirectResponse
      }
    }

    // Refresh last access timestamp (cookie lives 20 days to outlast the 15-day check)
    response.cookies.set(LAST_ACCESS_KEY, Date.now().toString(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 20 * 24 * 60 * 60,
      path: '/',
    })

    // Authenticated user on auth pages → send home
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      const redirectResponse = NextResponse.redirect(url)
      response.headers.getSetCookie().forEach((cookie) => {
        redirectResponse.headers.append('Set-Cookie', cookie)
      })
      return redirectResponse
    }
  } else {
    // Not authenticated → protect everything except auth routes
    if (!isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      const redirectResponse = NextResponse.redirect(url)
      response.headers.getSetCookie().forEach((cookie) => {
        redirectResponse.headers.append('Set-Cookie', cookie)
      })
      return redirectResponse
    }
  }

  return response
}

// Demo: sem Supabase. Rotas que dependem de conta ou banco não existem.
function demoMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Indisponível no modo demo' }, { status: 404 })
  }

  const accountRoutes = [...AUTH_ROUTES, ...PUBLIC_ROUTES]
  if (accountRoutes.includes(pathname) || pathname.startsWith('/settings')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
