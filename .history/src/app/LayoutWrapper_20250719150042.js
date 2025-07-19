// app/LayoutWrapper.js
'use client';

import { usePathname } from 'next/navigation';
import { SearchProvider } from '@/context/SearchContext';
import { UserProvider, useUser } from "@/context/UserContext";
import { JobsProvider } from "@/context/JobsContext";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname?.startsWith('/auth') || pathname?.startsWith('/questionnaire');
useEffect(() => {
  if (!loading && !user) {
    router.push('/auth/login');
  }
}, [user, loading, router]);
  return (
    <UserProvider>
      <JobsProvider>
        <SearchProvider>
          <div className="flex h-screen overflow-hidden bg-gray-50">
            {!hideLayout && <Sidebar />}
            <div className={`flex-1 flex flex-col overflow-hidden ${!hideLayout ? 'lg:ml-64' : ''}`}>
              {!hideLayout && <Navbar />}
              <main className={`flex-1 overflow-y-auto ${!hideLayout ? 'p-6 mt-16' : 'p-0'}`}>
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SearchProvider>
      </JobsProvider>
    </UserProvider>
  );
}