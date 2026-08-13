"use client";

import { useEffect, useState, type FormEvent } from "react";

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
}

export default function AdminBrandsPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function fetchLogos() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (res.ok && data.ok) {
        setLogos(data.logos);
      }
    } catch {
      console.error("Failed to load partner logos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogos();
  }, []);

  function openCreateModal() {
    setEditingLogo(null);
    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
    setDisplayOrder(logos.length + 1);
    setIsModalOpen(true);
  }

  function openEditModal(logo: ClientLogo) {
    setEditingLogo(logo);
    setName(logo.name);
    setLogoUrl(logo.logoUrl);
    setWebsiteUrl(logo.websiteUrl || "");
    setDisplayOrder(logo.displayOrder);
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setLogoUrl(data.url);
      } else {
        alert(data.error || "Failed to upload image to Vercel Blob");
      }
    } catch {
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingLogo ? "PUT" : "POST";
      const payload = {
        id: editingLogo?.id,
        name,
        logoUrl,
        websiteUrl,
        displayOrder,
      };

      const res = await fetch("/api/admin/brands", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchLogos();
      } else {
        alert(data.error || "Failed to save logo");
      }
    } catch {
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this partner logo?")) return;
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogos((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      alert("Failed to delete partner logo");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Trusted Partner & Client Logos</h1>
          <p className="text-sm text-slate-400">Manage institution, enterprise, and partner logos displayed on the homepage bar.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition shadow-lg"
        >
          + Add Partner Logo
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading partner logos...
        </div>
      ) : logos.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No partner logos added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map((logo) => (
            <div key={logo.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center">
                  <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{logo.name}</h3>
                  <p className="text-xs text-slate-400">{logo.websiteUrl || "No URL"}</p>
                  <span className="text-[10px] text-purple-400">Order: {logo.displayOrder}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(logo)}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-purple-500 hover:text-white"
                >
                  Edit ✏️
                </button>
                <button
                  onClick={() => handleDelete(logo.id)}
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
                {editingLogo ? "Edit Partner Logo" : "Add Partner Logo"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Institution / Company Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rawbank / Vodacom"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Logo Image</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/brand/logo-mark.png or Vercel Blob URL"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                  <label className="cursor-pointer rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 text-nowrap">
                    {uploading ? "Uploading..." : "Upload 📤"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Website URL (optional)</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
                  {saving ? "Saving..." : editingLogo ? "Update Logo" : "Save Partner Logo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
