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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useUser } from "@/context/UserContext";

const menuItems = [
  { label: "Dashboard", icon: <FiHome />, href: "/" },
  { label: "Job Board", icon: <FiBriefcase />, href: "/jobs" },
  { label: "My Applications", icon: <FiFileText />, href: "/applications" },
  { label: "Interviews", icon: <FiCalendar />, href: "/interviews" },
  { label: "Notifications", icon: <FiBell />, href: "/notifications" },
  { label: "Profile", icon: <FiUser />, href: "/profile" },
  { label: "Settings", icon: <FiSettings />, href: "/settings" },
];

const NavItem = ({ item, isActive, onClick, mobile = false }) => {
  if (mobile) {
    return (
      <SheetClose asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-navy text-cream"
              : "text-brown hover:bg-cream"
          )}
          onClick={onClick}
        >
          <span className={cn(
            "text-lg",
            isActive ? "text-cream" : "text-brown"
          )}>
            {item.icon}
          </span>
          {item.label}
        </Link>
      </SheetClose>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-navy text-cream"
          : "text-brown hover:bg-cream"
      )}
      onClick={onClick}
    >
      <span className={cn(
        "text-lg",
        isActive ? "text-cream" : "text-brown"
      )}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseSheet = () => setIsOpen(false);

  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F2ECE4] border-t border-brown/20 z-40">
          <nav className="p-2" aria-label="Mobile navigation">
            <ul className="flex justify-around">
              {menuItems.slice(0, 4).map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center p-2 text-xs ${isActive ? "text-navy" : "text-brown hover:text-navy"}`}
                      onClick={handleCloseSheet}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="text-lg" aria-hidden="true">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Sheet>
                  <SheetTrigger asChild>
                    <button 
                      className="flex flex-col items-center p-2 text-xs text-brown hover:text-navy"
                      aria-label="Open menu"
                    >
                      <span className="text-lg" aria-hidden="true"><FiMenu /></span>
                      <span>More</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent 
                    side="left" 
                    className="w-[280px] p-0 bg-cream"
                    aria-label="Navigation menu"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center h-16 px-6 border-b border-brown/20">
                        <Logo className="h-8 w-auto" />
                      </div>
                      <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                          {menuItems.map((item, idx) => {
                            const isActive = pathname === item.href;
                            return (
                              <li key={idx}>
                                <NavItem 
                                  item={item} 
                                  isActive={isActive} 
                                  onClick={handleCloseSheet}
                                  mobile
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </nav>
                      <div className="p-4 border-t border-brown/20">
                        <Button 
                          variant="outline" 
                          className="w-full border-brown text-brown hover:bg-brown/10" 
                          onClick={() => {
                            logout();
                            handleCloseSheet();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <FiLogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside 
      className="hidden lg:flex flex-col w-64 bg-[#F2ECE4] h-screen fixed left-0 top-0 z-20 border-r border-brown/20"
      aria-label="Sidebar"
    >
      <div className="flex items-center h-16 px-6 border-b border-brown/20">
        <Logo className="h-8 w-auto" />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx}>
                <NavItem 
                  item={item} 
                  isActive={isActive} 
                />
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t bg-[#efe587] border-brown/20">
        <Button 
          variant="outline" 
          className="w-full border-brown text-brown hover:bg-brown/10" 
          onClick={logout}
        >
          <div className="flex items-center gap-2">
            <FiLogOut className="h-4 w-4" />
            <span>Logout</span>
          </div>
        </Button>
      </div>
    </aside>
  );
}