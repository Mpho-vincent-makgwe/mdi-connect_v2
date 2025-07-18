I am trying to create a recruitment platform or webapp or website just I just can't tell what it should be
I too a layout from my old project that I have been working on but I want you to change everything about the layout not everything instead almost
the structure the layout the flow of responsiveness needs to be enhanced all in all
also alfter editing these components for the layout please create a suitable website for this app
since this is a mining, tourism and manufacturing sectors
keep it simple while looking like morden websites
keep consistent colors
I am using next js app routing with a src folder
I am using mongo db
first time users who don't have any information in their database will be redirected to a questionnaire since users won't register themselves but us by inputing details in backend
if user is skilled with qualifications or unskilled with qualification from the quesionaire they just took they will be taken to a page where the will upload their qualifications and other stuff since it's a recruitment platform
skilled users with experience but no qualifications will also have to provide proof someway
after all those processes they are all taken to a page with job advertisements and other stuff
now please go all out
// app/layout.js

import { GeistSans } from 'geist/font/sans';
import './globals.css';
import LayoutWrapper from './LayoutWrapper';

export const metadata = {
  title: 'MDI-Connect Recruitment Web Application',
  description: 'Employee leave management system',
};

export default function RootLayout({ children }) {
  return (
    `<html lang="en" className={GeistSans.className}>`
      `<body suppressHydrationWarning className="bg-gray-50">`
        `<LayoutWrapper>`
          {children}
        `</LayoutWrapper>`
      `</body>`
    `</html>`
  );
}
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
    `<UserProvider>`
      `<SearchProvider>`
        `<div className="flex h-screen overflow-hidden">`
          {!isAuthRoute && `<Sidebar />`}
          <div className={`flex-1 flex flex-col overflow-hidden ${!isAuthRoute ? 'lg:ml-64' : ''} pb-16 lg:pb-0`}>
            {!isAuthRoute && `<Navbar />`}
            <main className={`flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 ${!isAuthRoute ? 'mt-16' : ''}`}>
              {children}
            `</main>`
          `</div>`
        `</div>`
      `</SearchProvider>`
    `</UserProvider>`
  );
}
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
      `<header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 border-b border-gray-200">`
        `<div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">`
          {/* Loading skeleton */}
          `<div className="animate-pulse flex items-center space-x-4">`
            `<div className="rounded-full bg-gray-200 h-8 w-8"></div>`
            `<div className="h-4 bg-gray-200 rounded w-24"></div>`
          `</div>`
        `</div>`
      `</header>`
    );
  }

  return (
    `<header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 border-b border-gray-200">`
      `<div className="flex items-center justify-between h-full px-4 lg:px-6 w-full">`
        {/* Logo for mobile */}
        `<div className="lg:hidden flex items-center">`
          `<EtiLogo className="h-8 w-auto" />`
        `</div>`

    {/* Search Bar */}`<div className="relative w-full max-w-md mx-4">`
          `<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">`
            `<FaSearch className="text-sm" />`
        
          `<input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={handleSearch}
          />`
        `</div>`

    {/* Desktop View - Notification + User Info */}`<div className="hidden lg:flex items-center gap-6">`
          `<div className="relative">`
            `<button className="p-2 rounded-full hover:bg-gray-100 transition">`
              `<FaBell className="text-gray-500 text-lg" />`
              `<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />`
            `</button>`
          `</div>`

    {/* User Info */}
          {user ? (`<div className="flex items-center space-x-3">`
              `<div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">`
                {getInitials(user.name)}
              `</div>`
              `<div className="flex flex-col text-sm leading-tight">`
                `<span className="font-medium text-indigo-600">`{user.name}
                `<span className="text-gray-600 text-xs">`{user.role || "Employee"}
              `</div>`
              `<button className="text-indigo-600 hover:text-gray-700">`
                `<FaChevronDown className="text-xs" />`
              `</button>`
            `</div>`
          ) : (
            `<Link href="/auth/log-in" className="text-sm text-indigo-600 hover:text-indigo-800">`
              Sign In
            `</Link>`
          )}
        `</div>`

    {/* Mobile Settings Dropdown */}`<div className="lg:hidden relative">`
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition text-indigo-600"
          >
            `<FiSettings className="text-lg" />`
          `</button>`

    {isDropdownOpen && (`<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">`
              <Link
                href="/notifications"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                `<FaBell className="mr-3 text-indigo-600" />`
                Notifications
              `</Link>`
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                onClick={() => setIsDropdownOpen(false)}
              >
                `<div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 mr-3">`
                  `<FaUser />`
                `</div>`
                Profile
              `</Link>`
              {user ? (
                <Link
                  href="/auth/logout"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  `<FiSettings className="mr-3 text-indigo-600" />`
                  Logout
                `</Link>`
              ) : (
                <Link
                  href="/auth/log-in"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  `<FiSettings className="mr-3 text-indigo-600" />`
                  Sign In
                `</Link>`
              )}
            `</div>`
          )}
        `</div>`
      `</div>`
    `</header>`
  );
}
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
  { label: "Dashboard", icon: `<BsGridFill />`, href: "/" },
  { label: "Request Leave", icon: `<FaClipboardList />`, href: "/request-leave" },
  { label: "My Leaves", icon: `<FaUserFriends />`, href: "/my-leaves" },
  { label: "Holidays", icon: `<BsCalendarEvent />`, href: "/holidays" },
  { label: "Policies", icon: `<FaClipboardList />`, href: "/policies" },
  { label: "Notifications", icon: `<FaBell />`, href: "/notifications" },
  { label: "Profile", icon: `<FaUser />`, href: "/profile" },
  { label: "Logout", icon: `<FiLogOut />`, href: "/auth/logout" },
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
      `<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">`
        `<nav className="p-2">`
          `<ul className="flex justify-around">`
            {menu.slice(0, 5).map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                `<li key={idx}>`
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center p-3 rounded-full text-lg transition-colors ${                       isActive                         ? "bg-indigo-100 text-indigo-600"                         : "text-indigo-600 hover:bg-indigo-50"                     }`}
                    title={item.label}
                  >
                    {item.icon}
                  `</Link>`
                `</li>`
              );
            })}
          `</ul>`
        `</nav>`
      `</div>`
    );
  }

  return (
    `<aside className="hidden lg:block w-64 bg-white h-screen fixed left-0 top-0 z-20">`
      `<div className="flex items-center h-16 px-4">`
        `<EtiLogo className="h-8 w-auto" />`
      `</div>`
      `<nav className="p-4">`
        `<ul className="space-y-5">`
          {menu.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              `<li key={idx}>`
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${                     isActive                       ? "bg-[#4F46E5] text-white"                       : "text-gray-800 hover:bg-indigo-50"                   }`}
                >
                  <span
                    className={`text-lg ${                       isActive ? "text-white" : "text-indigo-600"                     }`}
                  >
                    {item.icon}
                
                  {item.label}
                `</Link>`
              `</li>`
            );
          })}
        `</ul>`
      `</nav>`
    `</aside>`
  );
}

the side and nav bars must be hidden on some pages like login or questions model/overlay
and everything must be connected to out backend
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  sector: { type: String, enum: ["Mining", "Tourism", "Manufacturing"], required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true }, // e.g., "$60,000 - $80,000 per year"
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  img: { type: String, required: true }, // URL to job post image
  requiredApplicants: { type: Number, required: true },
  appliedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
      phone: String,
      linkedin: String,
      coverLetter: String,
      resumeUrl: String,
      appliedAt: { type: Date, default: Date.now },
    }
  ],
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  deadline: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["skilled", "unskilled"], default: "unskilled" },
  experience: String,
  documents: [
    {
      filePath: String,
      fileType: String,
      fileName: String,
      fileUrl: String,
    }
  ],
  appliedJobs: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      coverLetter: String,
      resumeUrl: String,
      appliedAt: { type: Date, default: Date.now }, // Add application timestamp
    }
  ],
  yearsOfExperience: { type: String, default: "" },
  graduated: { type: String, default: "" },
  currentlyInTertiary: { type: String, default: "" },
  entryLevel: { type: String, default: "" },
  sector: { type: String, default: "" },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);

try to enhance evrything and try to make every component reusable and dynamic as possible
