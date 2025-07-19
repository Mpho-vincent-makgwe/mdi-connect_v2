// components/Sidebar.js
'use client';

import Link from "next/link";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiBriefcase, 
  FiFileText, 
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiUser,
  FiBell,
  FiMenu
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/context/UserContext"
const menuItems = [
  { label: "Dashboard", icon: <FiHome />, href: "/" },
  { label: "Job Board", icon: <FiBriefcase />, href: "/jobs" },
  { label: "My Applications", icon: <FiFileText />, href: "/applications" },
  { label: "Interviews", icon: <FiCalendar />, href: "/interviews" },
  { label: "Notifications", icon: <FiBell />, href: "/notifications" },
  { label: "Profile", icon: <FiUser />, href: "/profile" },
  { label: "Settings", icon: <FiSettings />, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <nav className="p-2">
            <ul className="flex justify-around">
              {menuItems.slice(0, 4).map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center p-2 text-xs ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <SheetTrigger asChild>
                  <button className="flex flex-col items-center p-2 text-xs text-gray-600 hover:text-blue-600">
                    <span className="text-lg"><FiMenu /></span>
                    <span>More</span>
                  </button>
                </SheetTrigger>
              </li>
            </ul>
          </nav>
        </div>

        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-6 border-b">
              <Logo className="h-8 w-auto" />
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={idx}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className={cn(
                          "text-lg",
                          isActive ? "text-blue-600" : "text-gray-500"
                        )}>
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white h-screen fixed left-0 top-0 z-20 border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b">
        <Logo className="h-8 w-auto" />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className={cn(
                    "text-lg",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/logout" className="flex items-center gap-2">
            <FiLogOut className="h-4 w-4" />
            <span>Logout</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}