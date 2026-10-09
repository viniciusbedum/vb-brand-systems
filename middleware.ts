import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { isDemoMode, isSignupEnabled } from '@/lib/features'
import { routing } from '@/i18n/routing'
import { localeHref, type Locale } from '@/i18n/locale-href'

const LAST_ACCESS_KEY = 'vb_last_access'
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000

// Caminhos SEM o prefixo de idioma (/br é tirado antes de comparar).
const AUTH_ROUTES = ['/login', '/signup']
// Acessíveis com ou sem sessão (o link de recuperação de senha cria a sessão nesta página)
const PUBLIC_ROUTES = ['/forgot-password', '/reset-password']

const handleI18n = createIntlMiddleware(routing)

/** Separa o idioma do caminho: "/br/login" -> { locale: "pt", path: "/login" }. */
function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue
    const prefix = localeHref('/', locale) // "/br"
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return { locale, path: pathname.slice(prefix.length) || '/' }
    }
  }
  return { locale: routing.defaultLocale, path: pathname }
}

function redirectTo(request: NextRequest, locale: Locale, path: string, from?: NextResponse) {
  const url = request.nextUrl.clone()
  url.pathname = localeHref(path, locale)
  const redirect = NextResponse.redirect(url)
  // Copia os cookies (sessão, idioma) já definidos na resposta de origem.
  from?.headers.getSetCookie().forEach((cookie) => redirect.headers.append('Set-Cookie', cookie))
  return redirect
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // APIs não têm idioma: só renovam a sessão (ou respondem 404 no demo).
  if (pathname.startsWith('/api/')) {
    return isDemoMode ? demoApi() : authApi(request)
  }

  // Idioma primeiro: detecta o idioma do navegador, aplica /br e define o cookie NEXT_LOCALE.
  const intlResponse = handleI18n(request)
  // Redirecionamento de idioma (ex.: / -> /br para navegador em português): devolve direto.
  if (intlResponse.headers.get('location')) return intlResponse

  const { locale, path } = splitLocale(pathname)

  if (isDemoMode) return demoMiddleware(request, intlResponse, locale, path)

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
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getUser() — validates JWT server-side (getSession() não valida no servidor)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Cadastro fechado: /signup volta para o login
  if (path === '/signup' && !isSignupEnabled) return redirectTo(request, locale, '/login', intlResponse)

  const isAuthRoute = AUTH_ROUTES.includes(path)

  if (PUBLIC_ROUTES.includes(path)) return intlResponse

  if (user) {
    // Check 15-day inactivity timeout
    const lastAccessStr = request.cookies.get(LAST_ACCESS_KEY)?.value
    if (lastAccessStr) {
      const lastAccess = Number(lastAccessStr)
      if (!isNaN(lastAccess) && Date.now() - lastAccess > FIFTEEN_DAYS_MS) {
        await supabase.auth.signOut()
        const redirect = redirectTo(request, locale, '/login', intlResponse)
        redirect.cookies.delete(LAST_ACCESS_KEY)
        return redirect
      }
    }

    // Refresh last access timestamp (cookie lives 20 days to outlast the 15-day check)
    intlResponse.cookies.set(LAST_ACCESS_KEY, Date.now().toString(), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 20 * 24 * 60 * 60,
      path: '/',
    })

    // Authenticated user on auth pages → send home
    if (isAuthRoute) return redirectTo(request, locale, '/', intlResponse)
  } else {
    // Not authenticated → protect everything except auth routes
    if (!isAuthRoute) return redirectTo(request, locale, '/login', intlResponse)
  }

  return intlResponse
}

// API routes handle their own auth — só devolvem com os cookies de sessão renovados.
async function authApi(request: NextRequest) {
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
  await supabase.auth.getUser()
  return response
}

function demoApi() {
  return NextResponse.json({ error: 'Not available in demo mode' }, { status: 404 })
}

// Demo: sem Supabase. Rotas que dependem de conta ou banco não existem.
function demoMiddleware(request: NextRequest, intlResponse: NextResponse, locale: Locale, path: string) {
  const accountRoutes = [...AUTH_ROUTES, ...PUBLIC_ROUTES]
  if (accountRoutes.includes(path) || path.startsWith('/settings')) {
    return redirectTo(request, locale, '/', intlResponse)
  }

  return intlResponse
}

export const config = {
  // Tudo, menos arquivos estáticos (qualquer caminho com extensão) e internos do Next.
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
