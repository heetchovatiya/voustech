"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  deliverables: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("web-apps");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [deliverablesInput, setDeliverablesInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchServices() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (res.ok && data.ok) {
        setServices(data.services);
      }
    } catch {
      console.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function openCreateModal() {
    setEditingService(null);
    setTitle("");
    setSlug("");
    setCategory("web-apps");
    setSummary("");
    setDescription("");
    setDeliverablesInput("Deliverable 1, Deliverable 2");
    setIsModalOpen(true);
  }

  function openEditModal(service: Service) {
    setEditingService(service);
    setTitle(service.title);
    setSlug(service.slug);
    setCategory(service.category);
    setSummary(service.summary);
    setDescription(service.description);
    try {
      const parsed = JSON.parse(service.deliverables);
      setDeliverablesInput(Array.isArray(parsed) ? parsed.join(", ") : service.deliverables);
    } catch {
      setDeliverablesInput(service.deliverables);
    }
    setIsModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const deliverablesArray = deliverablesInput.split(",").map((d) => d.trim()).filter(Boolean);

    try {
      const method = editingService ? "PUT" : "POST";
      const payload = {
        id: editingService?.id,
        title,
        slug,
        category,
        summary,
        description,
        deliverables: deliverablesArray,
      };

      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        alert(data.error || "Failed to save service");
      }
    } catch {
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      alert("Failed to delete service");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Services Offered</h1>
          <p className="text-sm text-slate-400">Manage digital agency services and client solution packages.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition shadow-lg"
        >
          + Add New Service
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No services created yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-purple-400 uppercase">
                    {s.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">/{s.slug}</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3">{s.summary}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(s)}
                  className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-purple-500 hover:text-white"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-red-500 hover:text-red-400"
                >
                  Delete 🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Service Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Custom Website Development"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Category Domain</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="web-apps">Web & Apps</option>
                    <option value="design-branding">Design & Branding</option>
                    <option value="business-systems">Business Systems</option>
                    <option value="infrastructure-growth">Infrastructure & Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">URL Slug (optional)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="website-development"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Summary</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One sentence summary of the service"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive service details..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Key Deliverables (comma separated)</label>
                <input
                  type="text"
                  value={deliverablesInput}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  placeholder="Custom Next.js layout, SEO optimization, CMS integration"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
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
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
