import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import "../globals.css";

export const metadata = {
  title: "VousTech Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {session ? (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md">
              <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <Link href="/admin" className="flex items-center gap-2.5 font-bold text-white text-lg tracking-tight">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-500/20">
                    V
                  </span>
                  VousTech Admin
                </Link>
              </div>
              <nav className="space-y-1 p-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  📊 Dashboard Overview
                </Link>
                <Link
                  href="/admin/leads"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  📬 Leads & Contacts
                </Link>
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  💼 Projects & Portfolio
                </Link>
                <Link
                  href="/admin/technologies"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  ⚡ Tech Stack
                </Link>
                <Link
                  href="/admin/services"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  🛠 Services (27)
                </Link>
                <Link
                  href="/admin/brands"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  🏢 Trusted Client Logos
                </Link>
                <Link
                  href="/admin/blog"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  ✍️ Blog Posts
                </Link>
                <Link
                  href="/admin/campaigns"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  📧 Email Campaigns
                </Link>
                <Link
                  href="/admin/testimonials"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  ⭐ Testimonials
                </Link>
                <Link
                  href="/admin/stats"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  📈 Company Stats
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  👥 Admin Users
                </Link>
                <Link
                  href="/admin/faqs"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  ❓ FAQs
                </Link>
              </nav>
            </aside>

            {/* Main content area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Topbar */}
              <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SQLite Active
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">
                    Logged in as <strong className="text-slate-200">{session.username}</strong> ({session.email})
                  </span>
                  <AdminLogoutButton />
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-slate-950">{children}</div>
        )}
      </body>
    </html>
  );
}
