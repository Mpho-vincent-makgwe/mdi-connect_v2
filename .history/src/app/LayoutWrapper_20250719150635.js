// app/LayoutWrapper.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SearchProvider } from '@/context/SearchContext';
import { UserProvider, useUser } from "@/context/UserContext";
import { JobsProvider } from "@/context/JobsContext";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

// This component handles the actual layout and protection
function ProtectedLayout({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const hideLayout = pathname?.startsWith('/auth') || pathname?.startsWith('/questionnaire');

  useEffect(() => {
    // Skip auth pages and allow questionnaire even if not logged in (if needed)
    if (loading || pathname?.startsWith('/auth')) return;

    if (!user) {
      router.push('/auth/login');
    } else if (!user.completedQuestionnaire && !pathname?.startsWith('/questionnaire')) {
      router.push('/questionnaire');
    }
  }, [user, loading, router, pathname]);

  // Show loading state while checking auth
  if (loading && !pathname?.startsWith('/auth')) {
    return <div>Loading...</div>;
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

// This wrapper provides all contexts
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