// app/LayoutWrapper.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SearchProvider } from '@/context/SearchContext';
import { UserProvider, useUser } from "@/context/UserContext";
import { JobsProvider } from "@/context/JobsContext";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';

// List of routes that don't require authentication
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];
// Routes that should be accessible after questionnaire completion
const POST_QUESTIONNAIRE_ROUTES = ['/jobs', '/upload-qualifications', '/dashboard'];

function ProtectedLayout({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // Determine if we should hide the layout (for auth/questionnaire pages)
  const hideLayout = pathname?.startsWith('/auth') || pathname?.startsWith('/questionnaire');

  useEffect(() => {
    if (loading || !pathname) return;

    // Skip public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      setInitialCheckComplete(true);
      return;
    }

    // User not authenticated
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // User needs to complete questionnaire
    if (!user.completedQuestionnaire && !pathname.startsWith('/questionnaire')) {
      router.push('/questionnaire');
      return;
    }

    // User completed questionnaire but trying to access questionnaire again
    if (user.completedQuestionnaire && pathname.startsWith('/questionnaire')) {
      // Redirect based on user type
      const redirectPath = user.role === 'skilled' ? '/upload-qualifications' : '/jobs';
      router.push(redirectPath);
      return;
    }

    setInitialCheckComplete(true);
  }, [user, loading, router, pathname]);

  // Show loading state while checking auth
  if ((loading || !initialCheckComplete) && !PUBLIC_ROUTES.some(route => pathname?.startsWith(route))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!hideLayout && <Sidebar />}
      <div className={`flex-1 flex flex-col overflow-hidden ${!hideLayout ? 'lg:ml-64' : ''}`}>
        {!hideLayout && <Navbar />}
        <main className={`flex-1 overflow-y-auto ${!hideLayout ? 'p-6 mt-16' : 'p-0'}`}>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <UserProvider>
      <JobsProvider>
        <SearchProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </SearchProvider>
      </JobsProvider>
    </UserProvider>
  );
}