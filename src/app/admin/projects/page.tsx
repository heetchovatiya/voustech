"use client";

import { useEffect, useState, type FormEvent } from "react";
import { convertImageToWebP } from "@/lib/imageUtils";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  imageUrl: string | null;
  projectUrl?: string | null;
  displayOrder?: number;
  featured: boolean;
  tags: string;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("webApps");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [featured, setFeatured] = useState(true);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    try {
      // Automatically convert image to WebP with optimal 80% compression
      const webpFile = await convertImageToWebP(rawFile, { quality: 0.8, maxDim: 1600 });

      const formData = new FormData();
      formData.append("file", webpFile);
      if (slug || title) {
        formData.append("name", slug || title);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setImageUrl(data.url);
      } else {
        alert(data.error || "Failed to upload image to Vercel Blob");
      }
    } catch {
      alert("Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (res.ok && data.ok) {
        setProjects(data.projects);
      }
    } catch {
      console.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function openCreateModal() {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setCategory("webApps");
    setSummary("");
    setDescription("");
    setImageUrl("");
    setProjectUrl("");
    setDisplayOrder(projects.length);
    setFeatured(true);
    setTagsInput("Next.js, React, TypeScript");
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setTitle(project.title);
    setSlug(project.slug);
    setCategory(project.category);
    setSummary(project.summary);
    setDescription(project.description);
    setImageUrl(project.imageUrl || "");
    setProjectUrl(project.projectUrl || "");
    setDisplayOrder(project.displayOrder ?? 0);
    setFeatured(project.featured);
    try {
      const parsed = JSON.parse(project.tags);
      setTagsInput(Array.isArray(parsed) ? parsed.join(", ") : project.tags);
    } catch {
      setTagsInput(project.tags);
    }
    setIsModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      const method = editingProject ? "PUT" : "POST";
      const payload = {
        id: editingProject?.id,
        title,
        slug,
        category,
        summary,
        description,
        imageUrl,
        projectUrl,
        displayOrder,
        featured,
        tags: tagsArray,
      };

      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchProjects();
      } else {
        alert(data.error || "Failed to save project");
      }
    } catch {
      alert("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects & Portfolio</h1>
          <p className="text-sm text-slate-400">Manage case studies and showcase projects displayed on the portfolio page.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition shadow-lg"
        >
          + Add New Project
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading portfolio projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No projects created yet. Click "+ Add New Project" to create one.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400 uppercase">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      ★ Featured
                    </span>
                  )}
                </div>

                {p.imageUrl && (
                  <div className="h-32 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <h3 className="text-lg font-bold text-white leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3">{p.summary}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">/{p.slug}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-blue-500 hover:text-white"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-red-500 hover:text-red-400"
                  >
                    Delete 🗑
                  </button>
                </div>
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
                {editingProject ? "Edit Project" : "Create New Project"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. NexPay Financial Analytics Portal"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="websites">Websites</option>
                    <option value="webApps">Web Applications</option>
                    <option value="mobileApps">Mobile Apps</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">URL Slug (optional)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="fintech-dashboard"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Short Summary</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One sentence description of the project"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full project breakdown..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Tech Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Prisma"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Project Image</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. /brand/logo-lockup-light.png or Vercel Blob URL"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                  <label className="cursor-pointer rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 text-nowrap">
                    {uploading ? "Uploading..." : "Upload 📤"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                {imageUrl.trim() && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-12 w-20 rounded object-cover border border-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="text-[11px] text-slate-400 font-mono truncate">{imageUrl}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Live Project URL (optional)</label>
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Display Order (0 = First)</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-300">Display as Featured Project</label>
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
                  {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
