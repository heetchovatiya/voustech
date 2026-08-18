"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  avatarUrl?: string;
  content: string;
  rating: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [company, setCompany] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function showToast(text: string, type: "success" | "error" = "success") {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (res.ok && data.ok) {
        setTestimonials(data.testimonials);
      }
    } catch {
      console.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  function closeModal() {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setClientName("");
    setClientRole("");
    setCompany("");
    setAvatarUrl("");
    setContent("");
    setRating(5);
  }

  function openCreateModal() {
    setEditingTestimonial(null);
    setClientName("");
    setClientRole("");
    setCompany("");
    setAvatarUrl("");
    setContent("");
    setRating(5);
    setIsModalOpen(true);
  }

  function openEditModal(t: Testimonial) {
    setEditingTestimonial(t);
    setClientName(t.clientName || "");
    setClientRole(t.clientRole || "");
    setCompany(t.company || "");
    setAvatarUrl(t.avatarUrl || "");
    setContent(t.content || "");
    setRating(t.rating ?? 5);
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
        setAvatarUrl(data.url);
        showToast("Avatar uploaded successfully", "success");
      } else {
        alert(data.error || "Failed to upload avatar image");
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

    const isEdit = Boolean(editingTestimonial);
    try {
      const method = isEdit ? "PUT" : "POST";
      const payload = {
        id: editingTestimonial?.id,
        clientName: clientName.trim(),
        clientRole: clientRole.trim(),
        company: company.trim(),
        avatarUrl: avatarUrl.trim(),
        content: content.trim(),
        rating,
      };

      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        closeModal();
        await fetchTestimonials();
        showToast(
          isEdit ? "✅ Testimonial updated successfully!" : "✅ Testimonial created successfully!",
          "success"
        );
      } else {
        alert(data.error || "Failed to save testimonial");
      }
    } catch {
      alert("An error occurred while saving testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        showToast("🗑 Testimonial deleted successfully", "success");
      } else {
        alert("Failed to delete testimonial");
      }
    } catch {
      alert("Failed to delete testimonial");
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-200"
              : "bg-red-950/80 border border-red-500/50 text-red-200"
          }`}
        >
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-xs opacity-75 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Client Testimonials</h1>
          <p className="text-sm text-slate-400">Manage client reviews, ratings, and quotes displayed on the website.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition shadow-lg flex items-center gap-2"
        >
          <span>+</span> Add Client Testimonial
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No testimonials added yet. Click &ldquo;+ Add Client Testimonial&rdquo; to add one.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between shadow-lg space-y-4 hover:border-slate-700 transition">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.clientName} className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {(t.clientName || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white leading-tight truncate">{t.clientName}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{t.clientRole}, {t.company}</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold tracking-widest shrink-0">{"★".repeat(t.rating || 5)}</span>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-4 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(t)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-amber-500 hover:text-white transition flex items-center gap-1.5"
                >
                  <span>✏️</span> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-red-500 hover:text-red-400 transition"
                  title="Delete testimonial"
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
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingTestimonial ? "Edit Testimonial" : "Add Client Testimonial"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-lg font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Jean-Marc Ilunga"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Director"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Ilunga Trading Group"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Client Avatar Image</label>
                <div className="mt-1 flex items-center gap-2">
                  {avatarUrl && (
                    <img src={avatarUrl} alt="Avatar preview" className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0" />
                  )}
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Image URL or upload below"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                  <label className="cursor-pointer rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 text-nowrap shrink-0">
                    {uploading ? "Uploading..." : "Upload 📤"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-2 text-xs text-red-400 hover:bg-slate-700 shrink-0"
                      title="Clear avatar"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Star Rating (1 - 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★ (4 Stars)</option>
                  <option value={3}>★★★ (3 Stars)</option>
                  <option value={2}>★★ (2 Stars)</option>
                  <option value={1}>★ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Testimonial Content / Review Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What the client said about VousTech's delivery and work..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-amber-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-amber-500 disabled:opacity-50 transition shadow-lg flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>{editingTestimonial ? "Save Changes" : "Save Testimonial"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
