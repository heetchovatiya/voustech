"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
  fullName: string;
  company: string | null;
  email: string;
  phone: string | null;
  serviceInterest: string;
  budgetRange: string | null;
  projectDetails: string;
  status: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok && data.ok) {
        setLeads(data.leads);
      }
    } catch {
      console.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lead submission?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch {
      alert("Failed to delete lead");
    }
  }

  const filtered = leads.filter(
    (l) =>
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.serviceInterest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contact Leads</h1>
          <p className="text-sm text-slate-400">Incoming consultation requests received from website visitors.</p>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading contact leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No leads found matching your filter.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Service Needed</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition ${
                        selectedLead?.id === lead.id ? "bg-blue-600/10 border-l-4 border-l-blue-500" : "hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-white">{lead.fullName}</td>
                      <td className="px-4 py-3 text-slate-300">{lead.email}</td>
                      <td className="px-4 py-3 text-slate-300">{lead.serviceInterest}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead.id);
                          }}
                          className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition"
                          title="Delete Lead"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Detail Panel */}
          <div>
            {selectedLead ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-lg">Lead Details</h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close ✕
                  </button>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Full Name</label>
                  <p className="font-medium text-white text-base">{selectedLead.fullName}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</label>
                    <p className="text-sm text-blue-400 break-all">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Phone</label>
                    <p className="text-sm text-slate-200">{selectedLead.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Company</label>
                    <p className="text-sm text-slate-200">{selectedLead.company || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Budget Range</label>
                    <p className="text-sm text-slate-200">{selectedLead.budgetRange || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Service Needed</label>
                  <p className="text-sm text-emerald-400 font-medium">{selectedLead.serviceInterest}</p>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Project Details</label>
                  <div className="mt-1 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedLead.projectDetails}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-500">
                Click on any lead in the table to inspect details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
