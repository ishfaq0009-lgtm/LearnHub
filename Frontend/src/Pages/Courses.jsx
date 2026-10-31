import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import api from "../lib/api";

const categories = ["All", "Web Development", "Programming", "Design", "Data Science", "Business", "Marketing", "Other"];
const palettes = ["from-white-100 to-neutral-200", "from-fuchsia-100 to-neutral-200", "from-white-100 to-neutral-200", "from-white-100 to-neutral-200"];

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const search = params.get("search") || "";
  const category = params.get("category") || "All";
  const [query, setQuery] = useState(search);

  const currentKey = `${search}::${category}`;
  const loading = loadedKey !== currentKey;

  useEffect(() => {
    let active = true;
    api.get("/api/courses", { params: { search, category, limit: 60 } })
      .then(({ data }) => { if (active) { setCourses(data.courses || []); setError(""); } })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load courses. Check your backend connection."); })
      .finally(() => { if (active) setLoadedKey(currentKey); });
    return () => { active = false; };
  }, [search, category, currentKey]);

  const updateParams = (next) => setParams((current) => {
    const value = new URLSearchParams(current);
    Object.entries(next).forEach(([key, item]) => item && item !== "All" ? value.set(key, item) : value.delete(key));
    return value;
  });

  return <div className="min-h-screen bg-slate-50"><PublicHeader /><main>
    <section className="bg-gradient-to-br from-slate-950 via-neutral-950 to-black px-6 py-14 text-white md:px-10 md:py-20"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-300">LEARN SOMETHING NEW</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Explore all courses</h1><p className="mt-4 max-w-xl text-sm leading-7 text-neutral-100">Browse the LearnHub library and find a course that fits your interests, experience and goals.</p></div></section>
    <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
      <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"><form onSubmit={(event) => { event.preventDefault(); updateParams({ search: query }); }} className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"><Search size={18} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search course title or topic" className="w-full text-sm outline-none" /><button className="text-sm font-bold text-neutral-700">Search</button></form><div className="flex items-center gap-2"><SlidersHorizontal size={17} className="text-slate-400" /><select value={category} onChange={(event) => updateParams({ category: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none md:w-52">{categories.map((item) => <option key={item}>{item}</option>)}</select></div></div>
      <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">{category === "All" ? "All courses" : category}</h2><span className="text-xs text-slate-500">{courses.length} {courses.length === 1 ? "course" : "courses"}</span></div>
      {loading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{[1,2,3,4,5,6,7,8].map((n) => <div key={n} className="h-64 animate-pulse rounded-2xl bg-slate-200" />)}</div> : error ? <div className="rounded-2xl border border-neutral-200 bg-white-50 p-6 text-sm text-neutral-700">{error}</div> : courses.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{courses.map((course, index) => <article key={course._id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Link to={`/courses/${course._id}`}><div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${palettes[index % palettes.length]} md:h-40`}>{course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition group-hover:scale-105" /> : <span className="text-5xl font-black text-neutral-800/50">{course.title[0]}</span>}</div><div className="p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-neutral-700">{course.category}</p><h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold text-slate-900">{course.title}</h3><p className="mt-2 line-clamp-2 min-h-9 text-xs leading-5 text-slate-500">{course.shortDescription}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span className="text-slate-500">{course.level}</span><strong className="text-slate-900">{Number(course.price) === 0 ? "Free" : `Rs. ${Number(course.price).toLocaleString()}`}</strong></div><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-neutral-700">View course <ArrowRight size={14} /></span></div></Link></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><BookOpen className="mx-auto text-slate-300" size={34} /><h3 className="mt-4 font-bold text-slate-900">No courses found</h3><p className="mt-2 text-sm text-slate-500">Try a different search or category. New courses will appear here when published.</p><button onClick={() => { setQuery(""); setParams({}); }} className="mt-5 text-sm font-bold text-neutral-700">Clear filters</button></div>}
    </section>
  </main><Footer /></div>;
}
