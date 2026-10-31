import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, BookOpen, Clock3, GraduationCap, Laptop, Search, Sparkles, Users } from "lucide-react";
import Footer from "../components/Footer";
import PublicHeader from "../components/PublicHeader";
import api from "../lib/api";

const benefits = [
  { icon: Users, title: "Expert Instructors", text: "Learn from knowledgeable educators" },
  { icon: Clock3, title: "Flexible Learning", text: "Study at your own pace" },
  { icon: Award, title: "Practical Skills", text: "Build knowledge that matters" },
  { icon: Laptop, title: "Learn Anywhere", text: "Access courses online" },
];

const palettes = ["from-white-100 to-neutral-200", "from-fuchsia-100 to-neutral-200", "from-white-100 to-neutral-200", "from-white-100 to-neutral-200"];

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/api/courses", { params: { limit: 4 } })
      .then(({ data }) => { if (active) setCourses(data.courses || []); })
      .catch(() => { if (active) setLoadError("Courses could not be loaded right now."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleCourses = courses.filter((course) => course.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main>
        <section className="relative isolate min-h-[430px] overflow-hidden bg-slate-950 md:min-h-[510px]">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=85" alt="Student learning online with a laptop" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/15" />
          <div className="mx-auto flex min-h-[430px] max-w-7xl items-center px-6 py-16 md:min-h-[510px] md:px-10">
            <div className="max-w-2xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/30 bg-neutral-400/10 px-4 py-2 text-xs font-semibold tracking-wide text-neutral-100"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">Learn New Skills.<br /><span className="text-neutral-300">Build a Better Future.</span></h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">Access useful online courses, learn at your own pace, and turn your curiosity into skills with LearnHub.</p>
              <form onSubmit={(event) => { event.preventDefault(); navigate(`/courses?search=${encodeURIComponent(search)}`); }} className="mt-8 flex max-w-lg rounded-xl bg-white p-1.5 shadow-xl shadow-black/20">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3 text-slate-400"><Search size={18} /><input aria-label="Search courses" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for courses..." className="w-full min-w-0 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" /></div>
                <button className="rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800">Search</button>
              </form>
              <div className="mt-6 flex flex-wrap gap-5 text-xs font-medium text-slate-300"><span className="inline-flex items-center gap-2"><BookOpen size={15} /> Practical courses</span><span className="inline-flex items-center gap-2"><GraduationCap size={16} /> Beginner friendly</span></div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white shadow-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-7 md:grid-cols-4 md:px-10">
            {benefits.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white-50 text-neutral-700"><Icon size={20} /></div><div><h3 className="text-sm font-bold text-slate-800">{title}</h3><p className="mt-1 text-xs text-slate-500">{text}</p></div></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16">
          <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">Start exploring</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Popular Courses</h2><p className="mt-2 text-sm text-slate-500">Find a course that matches your goals.</p></div><Link to="/courses" className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-neutral-700 hover:text-neutral-800">View all <ArrowRight size={16} /></Link></div>
          {loading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl bg-slate-200" />)}</div> : loadError ? <div className="rounded-2xl border border-neutral-200 bg-white-50 px-5 py-8 text-center text-sm text-neutral-800">{loadError} Make sure the backend is running.</div> : visibleCourses.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">{visibleCourses.map((course, index) => <CourseCard key={course._id} course={course} palette={palettes[index % palettes.length]} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white-50 text-neutral-700"><BookOpen size={25} /></div><h3 className="mt-4 font-bold text-slate-900">Courses are on their way</h3><p className="mt-2 text-sm text-slate-500">New courses will appear here as soon as the administrator publishes them.</p><Link to="/courses" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neutral-700">Browse all courses <ArrowRight size={16} /></Link></div>}
        </section>

        <section className="bg-black px-6 py-14 text-white md:px-10"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><p className="text-sm font-bold text-neutral-100">A smarter way to learn</p><h2 className="mt-2 max-w-2xl text-2xl font-extrabold sm:text-3xl">Small steps today can create big opportunities tomorrow.</h2></div><Link to="/courses" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-neutral-700 transition hover:bg-white-50">Explore courses <ArrowRight size={17} /></Link></div></section>
      </main>
      <Footer />
    </div>
  );
}

function CourseCard({ course, palette }) {
  return <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"><Link to={`/courses/${course._id}`} className="block"><div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${palette} md:h-40`}>{course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="text-5xl font-black text-neutral-800/60">{course.title.slice(0, 1).toUpperCase()}</div>}{course.featured && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-neutral-700">FEATURED</span>}</div><div className="p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-neutral-700">{course.category}</p><h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-slate-900 md:text-base">{course.title}</h3><p className="mt-2 line-clamp-2 min-h-9 text-xs leading-5 text-slate-500">{course.shortDescription}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>{course.level}</span><span className="font-bold text-slate-800">{Number(course.price) === 0 ? "Free" : `Rs. ${Number(course.price).toLocaleString()}`}</span></div></div></Link></article>;
}
