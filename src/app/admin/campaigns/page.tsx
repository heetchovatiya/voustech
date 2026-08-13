"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Campaign {
  id: string;
  subject: string;
  message: string;
  sentCount: number;
  sentAt: string;
}

interface CampaignStats {
  subscribersCount: number;
  leadsCount: number;
  totalAudienceCount: number;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats>({ subscribersCount: 0, leadsCount: 0, totalAudienceCount: 0 });
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendToLeads, setSendToLeads] = useState(true);
  const [sending, setSending] = useState(false);

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();
      if (res.ok && data.ok) {
        setCampaigns(data.campaigns);
        setStats(data.stats);
      }
    } catch {
      console.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function handleSendCampaign(e: FormEvent) {
    e.preventDefault();
    if (!confirm(`Are you sure you want to broadcast this email campaign to ${stats.totalAudienceCount} subscribers and clients?`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, sendToLeads }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        alert(`🎉 Campaign successfully sent to ${data.sentCount} recipients!`);
        setSubject("");
        setMessage("");
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to send campaign");
      }
    } catch {
      alert("Error broadcasting email campaign");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">VousTech News — Email Campaigns</h1>
        <p className="text-sm text-slate-400">Compose and send broadcast email updates to subscribers and registered clients.</p>
      </div>

      {/* Audience Stats Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase text-slate-400">Active Newsletter Subscribers</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{stats.subscribersCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase text-slate-400">Contact Leads / Clients</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{stats.leadsCount}</p>
        </div>
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase text-purple-400">Total Email Audience</p>
          <p className="mt-2 text-3xl font-extrabold text-purple-300">{stats.totalAudienceCount}</p>
        </div>
      </div>

      {/* Compose Campaign Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>✉️</span> Compose Broadcast Announcement
        </h2>

        <form onSubmit={handleSendCampaign} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">Email Subject Line</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. VousTech News: New Services & Product Update"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">Message Content (Markdown / Plaintext)</label>
            <textarea
              rows={6}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your email announcement message here..."
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendToLeads"
              checked={sendToLeads}
              onChange={(e) => setSendToLeads(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="sendToLeads" className="text-xs font-semibold text-slate-300">
              Also send campaign to all contact inquiry leads ({stats.leadsCount} leads)
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sending || stats.totalAudienceCount === 0}
              className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition shadow-lg flex items-center gap-2"
            >
              {sending ? "Broadcasting..." : "🚀 Broadcast Email Campaign"}
            </button>
          </div>
        </form>
      </div>

      {/* Past Campaigns List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Campaign Broadcast History</h2>
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
            Loading past campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
            No broadcast campaigns sent yet.
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="font-semibold text-white text-base">{c.subject}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{c.message}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    Sent to {c.sentCount} recipients
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">{new Date(c.sentAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
