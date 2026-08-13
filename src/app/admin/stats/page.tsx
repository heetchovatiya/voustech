"use client";

import { useEffect, useState, type FormEvent } from "react";

interface CompanyMetric {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  displayOrder: number;
}

export default function AdminStatsPage() {
  const [metrics, setMetrics] = useState<CompanyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<CompanyMetric | null>(null);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [suffix, setSuffix] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok && data.ok) {
        setMetrics(data.metrics);
      }
    } catch {
      console.error("Failed to load company metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  function openCreateModal() {
    setEditingMetric(null);
    setLabel("");
    setValue("");
    setSuffix("+");
    setDisplayOrder(metrics.length + 1);
    setIsModalOpen(true);
  }

  function openEditModal(m: CompanyMetric) {
    setEditingMetric(m);
    setLabel(m.label);
    setValue(m.value);
    setSuffix(m.suffix || "");
    setDisplayOrder(m.displayOrder);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingMetric ? "PUT" : "POST";
      const payload = {
        id: editingMetric?.id,
        label,
        value,
        suffix,
        displayOrder,
      };

      const res = await fetch("/api/admin/stats", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchMetrics();
      } else {
        alert(data.error || "Failed to save metric");
      }
    } catch {
      alert("An error occurred while saving metric");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this metric card?")) return;
    try {
      const res = await fetch(`/api/admin/stats?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMetrics((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete metric");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Company Metrics & Stats</h1>
          <p className="text-sm text-slate-400">Manage key statistics displayed on the homepage (e.g. 150+ Projects Delivered).</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg"
        >
          + Add Stat Metric
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading metrics...
        </div>
      ) : metrics.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No metrics added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between shadow-lg text-center space-y-3">
              <div>
                <p className="text-3xl font-extrabold text-blue-400 font-display">
                  {m.value}{m.suffix}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-300">{m.label}</p>
                <span className="text-[10px] text-slate-500 block mt-1">Order: {m.displayOrder}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-center gap-2">
                <button
                  onClick={() => openEditModal(m)}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-blue-500 hover:text-white"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-red-500 hover:text-red-400"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingMetric ? "Edit Stat Metric" : "Add Stat Metric"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Metric Label</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Projects Delivered / Happy Clients"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Number Value</label>
                  <input
                    type="text"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 150 or 95 or 24"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Suffix (optional)</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="e.g. + or % or /7"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingMetric ? "Update Metric" : "Save Metric"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
