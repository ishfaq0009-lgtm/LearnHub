import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CirclePlus, FileEdit, GraduationCap, Library, Mail, Sparkles } from "lucide-react";
import api from "../lib/api";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/api/courses/admin/all"),
      api.get("/api/contact/admin/messages", { params: { status: "all", limit: 1 } }),
    ])
      .then(([courseResponse, messageResponse]) => {
        if (active) {
          setCourses(courseResponse.data.courses || []);
          setUnreadMessages(messageResponse.data.unread || 0);
        }
      })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Could not load dashboard statistics."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const published = courses.filter((course) => course.status === "Published").length;
  const drafts = courses.length - published;
  const stats = [
    { label: "Total courses", value: courses.length, icon: Library, color: "bg-white-50 text-neutral-700" },
    { label: "Published", value: published, icon: GraduationCap, color: "bg-white-50 text-neutral-700" },
    { label: "Drafts", value: drafts, icon: FileEdit, color: "bg-white-50 text-neutral-700" },
    { label: "Unread messages", value: unreadMessages, icon: Mail, color: "bg-white-50 text-neutral-700" },
  ];

  return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">Overview</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1><p className="mt-2 text-sm text-slate-500">Manage your LearnHub course library from one place.</p></div><Link to="/admin/courses/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-neutral-800"><CirclePlus size={17} /> Add new course</Link></div>
    {error && <div className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{error}</div>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}><Icon size={22} /></div><span className="text-xs font-semibold text-slate-400">ALL TIME</span></div><p className="mt-5 text-3xl font-extrabold text-slate-900">{loading ? "—" : value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>)}</div>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_.6fr]"><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-bold text-slate-900">Recently added courses</h2><p className="mt-1 text-xs text-slate-500">Your latest course updates</p></div><Link to="/admin/courses" className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700">View all <ArrowRight size={14} /></Link></div>{loading ? <div className="space-y-4 p-6"><div className="h-12 animate-pulse rounded bg-slate-100" /><div className="h-12 animate-pulse rounded bg-slate-100" /></div> : courses.length ? <div className="divide-y divide-slate-100">{courses.slice(0, 5).map((course) => <div key={course._id} className="flex items-center gap-4 px-6 py-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white-50 text-lg font-bold text-neutral-700">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover" /> : course.title?.[0]}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{course.title}</p><p className="mt-1 text-xs text-slate-500">{course.category} · {course.level}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${course.status === "Published" ? "bg-white-50 text-neutral-700" : "bg-white-50 text-neutral-700"}`}>{course.status}</span><Link to={`/admin/courses/${course._id}/edit`} aria-label={`Edit ${course.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-white-50 hover:text-neutral-700"><FileEdit size={17} /></Link></div>)}</div> : <div className="px-6 py-12 text-center"><BookOpen className="mx-auto text-slate-300" size={30} /><p className="mt-3 text-sm font-semibold text-slate-800">No courses added yet</p><p className="mt-1 text-xs text-slate-500">Create your first course to start building the library.</p><Link to="/admin/courses/new" className="mt-4 inline-flex text-sm font-bold text-neutral-700">Add a course <ArrowRight size={15} /></Link></div>}</section>
      <aside className="rounded-2xl bg-gradient-to-br from-black to-black p-6 text-white shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Sparkles size={22} /></div><h2 className="mt-6 text-xl font-extrabold">Keep your library fresh</h2><p className="mt-3 text-sm leading-7 text-neutral-100">Add clear descriptions, a useful course outline and a good cover image to help learners understand what each course offers.</p><Link to="/admin/courses/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-neutral-700 hover:bg-white-50">Create a course <ArrowRight size={16} /></Link></aside>
    </div>
  </div>;
}
