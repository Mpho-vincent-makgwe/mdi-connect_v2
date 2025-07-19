import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const authRoutes = ['/auth/login', '/auth/register','/auth/*'];
const protectedRoutes = ['/', '/questionnaire', '/upload-qualifications', '/jobs'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // If it's an auth route and user is logged in, redirect to dashboard
  if (authRoutes.includes(pathname)) {
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
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
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

  return NextResponse.next();
}