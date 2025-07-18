'use client';

import { usePathname } from 'next/navigation';
import { SearchProvider } from '@/context/SearchContext';
import { UserProvider } from "@/context/UserContext";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <UserProvider>
      <SearchProvider>
        <div className="flex h-screen overflow-hidden">
          {!isAuthRoute && <Sidebar />}
          <div className={`flex-1 flex flex-col overflow-hidden ${!isAuthRoute ? 'lg:ml-64' : ''} pb-16 lg:pb-0`}>
            {!isAuthRoute && <Navbar />}
            <main className={`flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 ${!isAuthRoute ? 'mt-16' : ''}`}>
              {children}
            </main>
          </div>
        </div>
      </SearchProvider>
    </UserProvider>
  );
}