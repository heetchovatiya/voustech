import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [leadsCount, projectsCount, techCount, servicesCount, recentLeads] = await Promise.all([
    db.lead.count(),
    db.project.count(),
    db.technology.count(),
    db.service.count(),
    db.lead.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Welcome back, {session.username}. Here is your live site analytics and content summary.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Leads</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">📬</span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{leadsCount}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">💼</span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{projectsCount}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tech Stack</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">⚡</span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{techCount}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">🛠</span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{servicesCount}</p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white">Content Management Shortcuts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/projects"
            className="group rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-blue-500/50 hover:bg-blue-500/5"
          >
            <div className="font-semibold text-white group-hover:text-blue-400">Manage Projects →</div>
            <p className="mt-1 text-xs text-slate-400">Add or edit portfolio case studies</p>
          </Link>

          <Link
            href="/admin/technologies"
            className="group rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-amber-500/50 hover:bg-amber-500/5"
          >
            <div className="font-semibold text-white group-hover:text-amber-400">Manage Tech Stack →</div>
            <p className="mt-1 text-xs text-slate-400">Update frontend, backend, and cloud skills</p>
          </Link>

          <Link
            href="/admin/services"
            className="group rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-purple-500/50 hover:bg-purple-500/5"
          >
            <div className="font-semibold text-white group-hover:text-purple-400">Manage Services →</div>
            <p className="mt-1 text-xs text-slate-400">Create or modify service offerings</p>
          </Link>

          <Link
            href="/admin/leads"
            className="group rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-emerald-500/50 hover:bg-emerald-500/5"
          >
            <div className="font-semibold text-white group-hover:text-emerald-400">View Contact Leads →</div>
            <p className="mt-1 text-xs text-slate-400">Review consultation requests</p>
          </Link>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Consultation Requests</h2>
          <Link href="/admin/leads" className="text-xs font-medium text-blue-400 hover:underline">
            View All Leads →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">No leads submitted yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3 font-medium text-white">{lead.fullName}</td>
                    <td className="px-4 py-3">{lead.email}</td>
                    <td className="px-4 py-3">{lead.serviceInterest}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        lead.status === "new" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-slate-700 text-slate-300"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
