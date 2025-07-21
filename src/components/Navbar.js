// components/Navbar.js
'use client';

import { FiSearch, FiLogOut, FiBell, FiUser, FiChevronDown, FiMenu } from "react-icons/fi";
import { useState, useCallback } from "react";
import Logo from "./Logo";
import { useSearch } from "@/context/SearchContext";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar({ toggleSidebar }) {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, loading } = useUser();

  const handleSearch = useCallback(
    (e) => setSearchTerm(e.target.value),
    [setSearchTerm]
  );

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <header className="bg-cream shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 border-b border-brown/20">
        <div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">
          <div className="animate-pulse flex items-center space-x-4">
            <div className="rounded-full bg-brown/20 h-8 w-8"></div>
            <div className="h-4 bg-brown/20 rounded w-24"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#F2ECE4] shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 border-b border-brown/20">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center ml-2">
          <Logo className="h-8 w-auto" />
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-4 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-brown" />
          </div>
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="block w-full pl-10 pr-3 py-2 border border-brown/20 rounded-md leading-5 bg-cream placeholder-brown/50 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy sm:text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex  items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-brown hover:text-navy">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-brown hover:text-navy">
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-cream font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-brown capitalize">{user.role || "Candidate"}</span>
                  </div>
                  <FiChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-cream border-brown/20">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full text-brown hover:bg-brown/10">
                    <FiUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/logout" className="w-full text-brown hover:bg-brown/10">
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild className="border-brown text-brown hover:bg-brown/10">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-navy hover:bg-navy/90">
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Settings Dropdown */}
        <div className="lg:hidden relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-brown hover:text-navy">
                <FiUser className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-cream border-brown/20">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full text-brown hover:bg-brown/10">
                      <FiUser className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="w-full text-brown hover:bg-brown/10">
                      <FiBell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout" className="w-full text-brown hover:bg-brown/10">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/auth/login" className="w-full text-brown hover:bg-brown/10">
                    <FiUser className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}