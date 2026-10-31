import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CirclePlus, FileEdit, Search, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const location = useLocation();

  const loadCourses = useCallback(async () => {
    try { const { data } = await api.get("/api/courses/admin/all"); setCourses(data.courses || []); }
    catch (err) { setError(getErrorMessage(err, "Unable to load courses.")); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);
  const filtered = useMemo(() => courses.filter((course) => `${course.title} ${course.category}`.toLowerCase().includes(search.toLowerCase())), [courses, search]);

  async function handleDelete(course) {
    if (!window.confirm(`Delete "${course.title}"? This action cannot be undone.`)) return;
    setDeletingId(course._id); setError(""); setNotice("");
    try { const { data } = await api.delete(`/api/courses/${course._id}`); setCourses((current) => current.filter((item) => item._id !== course._id)); setNotice(data.message || "Course deleted successfully."); }
    catch (err) { setError(getErrorMessage(err, "Could not delete course.")); }
    finally { setDeletingId(""); }
  }

  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">Course library</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Manage courses</h1><p className="mt-2 text-sm text-slate-500">Add, update, publish, draft or remove courses.</p></div><Link to="/admin/courses/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800"><CirclePlus size={17} /> Add course</Link></div>
    {error && <div role="alert" className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{error}</div>}{(notice || location.state?.notice) && <div role="status" className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{notice || location.state.notice}</div>}
    <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-4 md:p-5"><div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"><Search size={18} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by course title or category" className="w-full text-sm outline-none" /></div></div>
      {loading ? <div className="space-y-3 p-6"><div className="h-14 animate-pulse rounded bg-slate-100" /><div className="h-14 animate-pulse rounded bg-slate-100" /><div className="h-14 animate-pulse rounded bg-slate-100" /></div> : filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4 font-bold">Course</th><th className="px-5 py-4 font-bold">Category</th><th className="px-5 py-4 font-bold">Price</th><th className="px-5 py-4 font-bold">Status</th><th className="px-5 py-4 text-right font-bold">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((course) => <tr key={course._id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white-50 font-bold text-neutral-700">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover" /> : course.title?.[0]}</div><div><p className="max-w-xs truncate text-sm font-bold text-slate-800">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.level} · {course.duration}</p></div></div></td><td className="px-5 py-4 text-sm text-slate-600">{course.category}</td><td className="px-5 py-4 text-sm font-semibold text-slate-700">{Number(course.price) === 0 ? "Free" : `Rs. ${Number(course.price).toLocaleString()}`}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${course.status === "Published" ? "bg-white-50 text-neutral-700" : "bg-white-50 text-neutral-700"}`}>{course.status}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Link to={`/admin/courses/${course._id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-neutral-200 hover:text-neutral-700"><FileEdit size={14} /> Edit</Link><button disabled={deletingId === course._id} onClick={() => handleDelete(course)} className="inline-flex items-center gap-1 rounded-lg border border-neutral-100 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-white-50 disabled:opacity-50"><Trash2 size={14} /> {deletingId === course._id ? "Deleting…" : "Delete"}</button></div></td></tr>)}</tbody></table></div> : <div className="px-6 py-16 text-center"><p className="font-bold text-slate-900">{search ? "No matching courses" : "Your course library is empty"}</p><p className="mt-2 text-sm text-slate-500">{search ? "Try another search term." : "Add your first course to make it available on the website."}</p>{!search && <Link to="/admin/courses/new" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neutral-700"><CirclePlus size={16} /> Add your first course</Link>}</div>}
    </div>
  </div>;
}
