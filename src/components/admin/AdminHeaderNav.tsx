"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard Overview", icon: "📊" },
  { href: "/admin/leads", label: "Leads & Contacts", icon: "📬" },
  { href: "/admin/projects", label: "Projects & Portfolio", icon: "💼" },
  { href: "/admin/services", label: "Services", icon: "🛠" },
  { href: "/admin/technologies", label: "Tech Stack", icon: "⚡" },
  { href: "/admin/brands", label: "Trusted Client Logos", icon: "🏢" },
  { href: "/admin/blog", label: "Blog Posts", icon: "✍️" },
  { href: "/admin/campaigns", label: "Email Campaigns", icon: "📧" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/stats", label: "Company Stats", icon: "📈" },
  { href: "/admin/users", label: "Admin Users", icon: "👥" },
  { href: "/admin/faqs", label: "FAQs", icon: "❓" },
];

export function AdminHeaderNav({
  username,
  email,
  children,
}: {
  username: string;
  email: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold text-white text-lg tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/20">
              V
            </span>
            VousTech Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              PostgreSQL (Neon) Active
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <span className="text-xs text-slate-400 truncate max-w-[160px] sm:max-w-xs">
              <span className="hidden sm:inline">Logged in as </span>
              <strong className="text-slate-200">{username}</strong>
            </span>
            <AdminLogoutButton />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-900 p-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
