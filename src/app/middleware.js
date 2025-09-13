import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const authRoutes = ['/auth/login', '/auth/register'];
const publicRoutes = ['/auth/complete-registration']; // Add any public routes if needed
const protectedRoutes = ['/', '/questionnaire', '/upload-qualifications', '/jobs'];
const adminRoutes = ['/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if current route is public or has token parameter (invitation)
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.includes('token=') ||
                        (pathname.startsWith('/auth/') && 
                        !authRoutes.some(route => pathname === route));

  // Check if current route is auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if current route is admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If it's a public route or has token parameter, allow access
  if (isPublicRoute || pathname.includes('token=')) {
    return NextResponse.next();
  }

  // If it's an auth route and user is logged in, redirect to appropriate dashboard
  if (isAuthRoute) {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Redirect based on role
        if (decoded.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        // Invalid token, proceed with auth route
      }
    }
    return NextResponse.next();
  }

  // If it's a protected route
  if (isProtectedRoute || isAdminRoute) {
    if (!token) {
      // Redirect to login but preserve invitation token if present
      const url = new URL('/auth/login', request.url);
      if (request.nextUrl.searchParams.get('token')) {
        url.searchParams.set('token', request.nextUrl.searchParams.get('token'));
      }
      return NextResponse.redirect(url);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check admin access
      if (isAdminRoute && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Check non-admin trying to access admin routes
      if (decoded.role !== 'admin' && isAdminRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Check admin trying to access non-admin routes
      if (decoded.role === 'admin' && isProtectedRoute) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Default deny for any other routes not explicitly handled
  return NextResponse.redirect(new URL('/auth/login', request.url));
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};