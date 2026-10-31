import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, GraduationCap, PlayCircle } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import api from "../lib/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get(`/api/courses/${id}`)
      .then(({ data }) => { if (active) setCourse(data.course); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Could not load this course."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return <div className="min-h-screen bg-slate-50"><PublicHeader />{loading ? <div className="mx-auto max-w-7xl animate-pulse px-6 py-20"><div className="h-8 w-1/2 rounded bg-slate-200" /><div className="mt-5 h-64 rounded-2xl bg-slate-200" /></div> : error || !course ? <main className="mx-auto max-w-4xl px-6 py-24 text-center"><h1 className="text-2xl font-bold text-slate-900">Course unavailable</h1><p className="mt-3 text-sm text-slate-500">{error || "This course may have been removed or is not published."}</p><Link to="/courses" className="mt-6 inline-flex items-center gap-2 font-bold text-neutral-700"><ArrowLeft size={16} /> Back to courses</Link></main> : <main>
    <section className="bg-slate-950 px-6 py-14 text-white md:px-10 md:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-center"><div><Link to="/courses" className="inline-flex items-center gap-2 text-sm text-neutral-200 hover:text-white"><ArrowLeft size={16} /> All courses</Link><p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-neutral-300">{course.category}</p><h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{course.title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{course.shortDescription}</p><div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><GraduationCap size={17} /> {course.level}</span><span className="inline-flex items-center gap-2"><Clock3 size={17} /> {course.duration}</span><span className="inline-flex items-center gap-2"><BookOpen size={17} /> {course.curriculum?.length || 0} lessons</span></div></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">{course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="aspect-video w-full object-cover" /> : <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-neutral-500 to-black"><BookOpen size={64} className="text-white/70" /></div>}<div className="p-6"><p className="text-sm text-slate-300">Course price</p><p className="mt-1 text-3xl font-extrabold">{Number(course.price) === 0 ? "Free" : `Rs. ${Number(course.price).toLocaleString()}`}</p><p className="mt-2 text-xs text-slate-400">Instructor: {course.instructor}</p></div></div></div></section>
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1fr_360px]"><div><h2 className="text-2xl font-extrabold text-slate-900">About this course</h2><p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">{course.description || course.shortDescription}</p><h2 className="mt-10 text-2xl font-extrabold text-slate-900">What you will learn</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{(course.curriculum?.length ? course.curriculum : [{ title: "Course introduction" }, { title: "Core concepts and practical skills" }]).map((item, index) => <div key={`${item.title}-${index}`} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 shrink-0 text-neutral-700" size={17} />{item.title}</div>)}</div></div><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white-50 text-neutral-700"><PlayCircle size={23} /></div><div><h3 className="font-bold text-slate-900">Ready to learn?</h3><p className="text-xs text-slate-500">More course features coming soon</p></div></div><p className="mt-5 text-sm leading-6 text-slate-600">This page provides the course overview and lesson outline. Learning progress and student enrolment are not enabled yet.</p><Link to="/courses" className="mt-6 flex items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800">Explore other courses</Link></aside></section>
  </main>}<Footer /></div>;
}
