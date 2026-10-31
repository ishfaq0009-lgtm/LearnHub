import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";

const initialForm = { title: "", category: "Web Development", level: "Beginner", duration: "", price: "0", instructor: "", shortDescription: "", description: "", thumbnail: "", curriculum: "", featured: false, status: "Published" };
const categories = ["Web Development", "Programming", "Design", "Data Science", "Business", "Marketing", "Other"];
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-neutral-500 focus:ring-4 focus:ring-neutral-50";

export default function CourseForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    let active = true;
    api.get("/api/courses/admin/all").then(({ data }) => {
      const course = (data.courses || []).find((item) => item._id === id);
      if (!course) throw new Error("Course not found.");
      if (active) {
        setForm({ title: course.title || "", category: course.category || "Web Development", level: course.level || "Beginner", duration: course.duration || "", price: String(course.price ?? 0), instructor: course.instructor || "", shortDescription: course.shortDescription || "", description: course.description || "", thumbnail: course.thumbnail || "", curriculum: (course.curriculum || []).map((item) => item.title).join("\n"), featured: Boolean(course.featured), status: course.status || "Published" });
        setPreview(course.thumbnail || "");
      }
    }).catch((err) => { if (active) setError(getErrorMessage(err, "Could not load this course.")); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function change(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, key === "featured" ? String(value) : value));
      if (file) payload.append("thumbnailFile", file);
      const response = editing ? await api.put(`/api/courses/${id}`, payload) : await api.post("/api/courses", payload);
      if (!response.data.success) throw new Error(response.data.message || "Unable to save course.");
      navigate("/admin/courses", { replace: true, state: { notice: response.data.message } });
    } catch (err) { setError(getErrorMessage(err, "Unable to save course.")); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="animate-pulse rounded-2xl bg-white p-10 text-sm text-slate-500">Loading course details…</div>;
  const previewUrl = preview || form.thumbnail;

  return <div className="mx-auto max-w-4xl"><Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-neutral-700"><ArrowLeft size={16} /> Back to courses</Link><div className="mt-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">{editing ? "Edit course" : "Create content"}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{editing ? "Update course" : "Add a new course"}</h1><p className="mt-2 text-sm text-slate-500">Provide clear details so learners know what to expect.</p></div>
    {error && <div role="alert" className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{error}</div>}
    <form onSubmit={handleSubmit} className="mt-7 space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <section><h2 className="font-bold text-slate-900">Basic information</h2><p className="mt-1 text-xs text-slate-500">The title and short description appear in course cards.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">Course title *</label><input id="title" required maxLength={120} value={form.title} onChange={(event) => change("title", event.target.value)} placeholder="e.g. Complete Web Development" className={inputClass} /></div><div><label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Category *</label><select id="category" value={form.category} onChange={(event) => change("category", event.target.value)} className={inputClass}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="level" className="mb-2 block text-sm font-semibold text-slate-700">Level</label><select id="level" value={form.level} onChange={(event) => change("level", event.target.value)} className={inputClass}>{["Beginner", "Intermediate", "Advanced", "All Levels"].map((item) => <option key={item}>{item}</option>)}</select></div><div><label htmlFor="duration" className="mb-2 block text-sm font-semibold text-slate-700">Course duration</label><input id="duration" value={form.duration} onChange={(event) => change("duration", event.target.value)} placeholder="e.g. 6 weeks" className={inputClass} /></div><div><label htmlFor="price" className="mb-2 block text-sm font-semibold text-slate-700">Price (Rs.)</label><input id="price" type="number" min="0" step="1" value={form.price} onChange={(event) => change("price", event.target.value)} className={inputClass} /></div><div><label htmlFor="instructor" className="mb-2 block text-sm font-semibold text-slate-700">Instructor</label><input id="instructor" value={form.instructor} onChange={(event) => change("instructor", event.target.value)} placeholder="Instructor name" className={inputClass} /></div><div><label htmlFor="status" className="mb-2 block text-sm font-semibold text-slate-700">Visibility</label><select id="status" value={form.status} onChange={(event) => change("status", event.target.value)} className={inputClass}><option>Published</option><option>Draft</option></select></div><div className="sm:col-span-2"><label htmlFor="shortDescription" className="mb-2 block text-sm font-semibold text-slate-700">Short description *</label><textarea id="shortDescription" required maxLength={220} rows={2} value={form.shortDescription} onChange={(event) => change("shortDescription", event.target.value)} placeholder="A short summary for the course card" className={`${inputClass} resize-y`} /><p className="mt-1 text-right text-[11px] text-slate-400">{form.shortDescription.length}/220</p></div><div className="sm:col-span-2"><label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Full description</label><textarea id="description" rows={5} value={form.description} onChange={(event) => change("description", event.target.value)} placeholder="Explain the course, its goals and who it is for..." className={`${inputClass} resize-y`} /></div></div></section>
      <div className="border-t border-slate-100" />
      <section><h2 className="font-bold text-slate-900">Course image</h2><p className="mt-1 text-xs text-slate-500">Paste an image URL or upload an image (maximum 5 MB, Cloudinary must be configured for uploads).</p><div className="mt-5 grid gap-5 sm:grid-cols-[1fr_220px]"><div><label htmlFor="thumbnail" className="mb-2 block text-sm font-semibold text-slate-700">Image URL</label><input id="thumbnail" type="url" value={form.thumbnail} onChange={(event) => { change("thumbnail", event.target.value); setFile(null); }} placeholder="https://example.com/course-image.jpg" className={inputClass} /><label htmlFor="thumbnailFile" className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-4 text-sm font-semibold text-slate-600 hover:border-neutral-400 hover:bg-white-50"><ImagePlus size={18} /> {file ? file.name : "Choose image file"}</label><input id="thumbnailFile" type="file" accept="image/*" className="hidden" onChange={(event) => { const selected = event.target.files?.[0]; if (selected && selected.size > 5 * 1024 * 1024) { setError("Image must be 5 MB or smaller."); event.target.value = ""; return; } setError(""); setFile(selected || null); }} /></div><div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-slate-100">{previewUrl ? <img src={previewUrl} alt="Course preview" className="h-full w-full object-cover" /> : <div className="text-center text-slate-400"><ImagePlus className="mx-auto" size={28} /><p className="mt-2 text-xs">Image preview</p></div>}</div></div></section>
      <div className="border-t border-slate-100" />
      <section><h2 className="font-bold text-slate-900">Course curriculum</h2><p className="mt-1 text-xs text-slate-500">Add one lesson title per line. These display as the course outline.</p><textarea rows={5} value={form.curriculum} onChange={(event) => change("curriculum", event.target.value)} placeholder={"Introduction to the course\nGetting started\nCore concepts\nPractical project"} className={`${inputClass} mt-4 resize-y`} /></section>
      <section className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={form.featured} onChange={(event) => change("featured", event.target.checked)} className="mt-1 h-4 w-4 accent-neutral-600" /><span><span className="block text-sm font-semibold text-slate-800">Feature this course</span><span className="mt-1 block text-xs text-slate-500">Featured courses can appear in the Home page popular section.</span></span></label><span className="text-xs font-semibold text-slate-500">{form.status === "Published" ? "Visible to learners" : "Only visible to admins"}</span></section>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end"><Link to="/admin/courses" className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</Link><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-60"><Save size={17} />{saving ? "Saving…" : editing ? "Save changes" : "Create course"}</button></div>
    </form>
  </div>;
}
