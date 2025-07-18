"use client";

import { FaSearch, FaBell, FaUser, FaChevronDown } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useState, useCallback } from "react";
import EtiLogo from "./Logo";
import { useSearch } from "@/context/SearchContext";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, loading } = useUser();

  const handleSearch = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm]
  );

  // Get user initials safely
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">
          {/* Loading skeleton */}
          <div className="animate-pulse flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 h-8 w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">
        {/* Logo for mobile */}
        <div className="lg:hidden flex items-center">
          <EtiLogo className="h-8 w-auto" />
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-4">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Desktop View - Notification + User Info */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <FaBell className="text-gray-500 text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>

          {/* User Info */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col text-sm leading-tight">
                <span className="font-medium text-indigo-600">{user.name}</span>
                <span className="text-gray-600 text-xs">{user.role || "Employee"}</span>
              </div>
              <button className="text-indigo-600 hover:text-gray-700">
                <FaChevronDown className="text-xs" />
              </button>
            </div>
          ) : (
            <Link href="/auth/log-in" className="text-sm text-indigo-600 hover:text-indigo-800">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Settings Dropdown */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition text-indigo-600"
          >
            <FiSettings className="text-lg" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <Link
                href="/notifications"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaBell className="mr-3 text-indigo-600" />
                Notifications
              </Link>
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 mr-3">
                  <FaUser />
                </div>
                Profile
              </Link>
              {user ? (
                <Link
                  href="/auth/logout"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiSettings className="mr-3 text-indigo-600" />
                  Logout
                </Link>
              ) : (
                <Link
                  href="/auth/log-in"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiSettings className="mr-3 text-indigo-600" />
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}