import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  
  // Check for admin routes
  const isAdminPath = request.nextUrl.pathname.startsWith('/duhet-admini')
  const isAdminLoginPath = request.nextUrl.pathname === '/duhet-admini'
  
  // Protect admin routes
  if (isAdminPath) {
    // If not authenticated and trying to access admin routes (except login), redirect to admin login
    if (!isAuthenticated && !isAdminLoginPath) {
      return NextResponse.redirect(new URL('/duhet-admini', request.url))
    }
    
    // If authenticated but not admin, redirect to admin login
    if (isAuthenticated && token?.email !== 'qwerty@qwerty.com' && !isAdminLoginPath) {
      return NextResponse.redirect(new URL('/duhet-admini', request.url))
    }

    // If admin is trying to access admin login page while authenticated, redirect to admin dashboard
    if (isAuthenticated && token?.email === 'qwerty@qwerty.com' && isAdminLoginPath) {
      return NextResponse.redirect(new URL('/duhet-admini/dashboard', request.url))
    }
  }

  // Regular auth routes handling
  const isAuthPath = request.nextUrl.pathname.startsWith('/auth/')
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
  
  // If accessing auth pages while authenticated, redirect to appropriate dashboard
  if (isAuthPath && isAuthenticated) {
    if (token?.email === 'qwerty@qwerty.com') {
      return NextResponse.redirect(new URL('/duhet-admini/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard routes from non-authenticated and admin users
  if (isDashboardPath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    // Redirect admin to admin dashboard if they try to access regular dashboard
    if (token?.email === 'qwerty@qwerty.com') {
      return NextResponse.redirect(new URL('/duhet-admini/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/duhet-admini/:path*'
  ]
}