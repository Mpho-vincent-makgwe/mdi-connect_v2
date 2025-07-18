// components/Sidebar.js
"use client";

import Link from "next/link";
import EtiLogo from "./Logo";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { BsGridFill, BsCalendarEvent } from "react-icons/bs";
import { FaClipboardList, FaUserFriends, FaBell, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";

const menu = [
  { label: "Dashboard", icon: <BsGridFill />, href: "/" },
  { label: "Request Leave", icon: <FaClipboardList />, href: "/request-leave" },
  { label: "My Leaves", icon: <FaUserFriends />, href: "/my-leaves" },
  { label: "Holidays", icon: <BsCalendarEvent />, href: "/holidays" },
  { label: "Policies", icon: <FaClipboardList />, href: "/policies" },
  { label: "Notifications", icon: <FaBell />, href: "/notifications" },
  { label: "Profile", icon: <FaUser />, href: "/profile" },
  { label: "Logout", icon: <FiLogOut />, href: "/auth/logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isTablet) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <nav className="p-2">
          <ul className="flex justify-around">
            {menu.slice(0, 5).map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center p-3 rounded-full text-lg transition-colors ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-indigo-600 hover:bg-indigo-50"
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-64 bg-white h-screen fixed left-0 top-0 z-20">
      <div className="flex items-center h-16 px-4">
        <EtiLogo className="h-8 w-auto" />
      </div>
      <nav className="p-4">
        <ul className="space-y-5">
          {menu.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#4F46E5] text-white"
                      : "text-gray-800 hover:bg-indigo-50"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-white" : "text-indigo-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
