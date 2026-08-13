"use client";

import { useEffect, useState, type FormEvent } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  displayOrder: number;
  hidden: boolean;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [hidden, setHidden] = useState(false);
  const [saving, setSaving] = useState(false);

  async function fetchFaqs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (res.ok && data.ok) {
        setFaqs(data.faqs);
      }
    } catch {
      console.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFaqs();
  }, []);

  function openCreateModal() {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("general");
    setDisplayOrder(faqs.length + 1);
    setHidden(false);
    setIsModalOpen(true);
  }

  function openEditModal(faq: FaqItem) {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || "general");
    setDisplayOrder(faq.displayOrder);
    setHidden(faq.hidden);
    setIsModalOpen(true);
  }

  async function toggleHide(faq: FaqItem) {
    try {
      const updatedHidden = !faq.hidden;
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faq.id, hidden: updatedHidden }),
      });

      if (res.ok) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === faq.id ? { ...f, hidden: updatedHidden } : f))
        );
      }
    } catch {
      alert("Failed to update FAQ visibility");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingFaq ? "PUT" : "POST";
      const payload = {
        id: editingFaq?.id,
        question,
        answer,
        category,
        displayOrder,
        hidden,
      };

      const res = await fetch("/api/admin/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert(data.error || "Failed to save FAQ");
      }
    } catch {
      alert("An error occurred while saving FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      alert("Failed to delete FAQ");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Frequently Asked Questions (FAQs)</h1>
          <p className="text-sm text-slate-400">Manage site FAQs and toggle visibility to hide or show questions on the live website.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 transition shadow-lg"
        >
          + Add New FAQ
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          Loading FAQs...
        </div>
      ) : faqs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
          No FAQs added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`rounded-xl border p-5 flex flex-col justify-between shadow-lg transition ${
                faq.hidden ? "border-slate-800 bg-slate-950/60 opacity-60" : "border-slate-800 bg-slate-900"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300 uppercase">
                    {faq.category || "General"}
                  </span>
                  <button
                    onClick={() => toggleHide(faq)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold transition border ${
                      faq.hidden
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                    }`}
                  >
                    {faq.hidden ? "👁️ Hidden (Click to Show)" : "✓ Visible on Site"}
                  </button>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{faq.question}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Order: #{faq.displayOrder}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:border-teal-500 hover:text-white"
                  >
                    Edit ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What is your typical project timeline?"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Detailed answer text..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="general"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="hiddenToggle"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="hiddenToggle" className="text-xs font-medium text-slate-300">
                  Hide this FAQ from public website
                </label>
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
                  className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
