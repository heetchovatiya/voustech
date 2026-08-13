"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Technology {
  id: string;
  slug: string;
  name: string;
  category: string;
  iconName: string | null;
  description: string;
  displayOrder: number;
  featured: boolean;
}

export default function AdminTechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("frontend");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [featured, setFeatured] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchTechnologies() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/technologies");
      const data = await res.json();
      if (res.ok && data.ok) {
        setTechs(data.technologies);
      }
    } catch {
      console.error("Failed to load technologies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTechnologies();
  }, []);

  function openCreateModal() {
    setEditingTech(null);
    setName("");
    setSlug("");
    setCategory("frontend");
    setDescription("");
    setDisplayOrder(techs.length + 1);
    setFeatured(true);
    setIsModalOpen(true);
  }

  function openEditModal(tech: Technology) {
    setEditingTech(tech);
    setName(tech.name);
    setSlug(tech.slug);
    setCategory(tech.category);
    setDescription(tech.description);
    setDisplayOrder(tech.displayOrder);
    setFeatured(tech.featured);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingTech ? "PUT" : "POST";
      const payload = {
        id: editingTech?.id,
        name,
        slug,
        category,
        description,
        displayOrder,
        featured,
      };

      const res = await fetch("/api/admin/technologies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchTechnologies();
      } else {
        alert(data.error || "Failed to save technology");
      }
    } catch {
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this technology?")) return;
    try {
      const res = await fetch(`/api/admin/technologies?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTechs((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      alert("Failed to delete technology");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tech Stack</h1>
          <p className="text-sm text-slate-400">Manage frameworks, languages, and cloud tools displayed on the site.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition shadow-lg"
        >
          + Add New Technology
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading tech stack items...
        </div>
      ) : techs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No technologies added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techs.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2 shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300 uppercase">
                  {t.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">#{t.displayOrder}</span>
              </div>

              <h3 className="font-bold text-white text-base">{t.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(t)}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-amber-500 hover:text-white"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-red-500 hover:text-red-400"
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
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingTech ? "Edit Technology" : "Add New Technology"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Technology Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Mobile</option>
                    <option value="cloud">Cloud / DB</option>
                    <option value="ai">AI / Automation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of tech capability..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
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
                  className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingTech ? "Update Technology" : "Create Technology"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
