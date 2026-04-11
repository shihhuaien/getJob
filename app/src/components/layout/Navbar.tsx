"use client";

import Link from "next/link";
import { useState } from "react";
import { Briefcase, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">JobHunter</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            功能特色
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            方案價格
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            登入
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            免費註冊
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="切換選單"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              功能特色
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              方案價格
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              登入
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              免費註冊
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
