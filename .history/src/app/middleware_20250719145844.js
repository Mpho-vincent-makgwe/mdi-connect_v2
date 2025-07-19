import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const authRoutes = ['/auth/login', '/auth/register'];
const publicRoutes = []; // Add any public routes if needed
const protectedRoutes = ['/', '/questionnaire', '/upload-qualifications', '/jobs'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname) || 
                        pathname.startsWith('/auth/') && 
                        !authRoutes.some(route => pathname === route);

  // Check if current route is auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If it's an auth route and user is logged in, redirect to dashboard
  if (isAuthRoute) {
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        // Invalid token, proceed with auth route
      }
    }
    return NextResponse.next();
  }

  // If it's a protected route
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
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