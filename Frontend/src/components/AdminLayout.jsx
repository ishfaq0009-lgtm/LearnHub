import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Library, LogOut, Mail, Menu, X, ShieldCheck } from "lucide-react";
import api from "../lib/api";

export default function AdminLayout() {
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get("/user/me")
      .then(({ data }) => { if (active) setAdmin(data.admin); })
      .catch(() => {
        sessionStorage.removeItem("learnhub_token");
        if (active) navigate("/admin/login", { replace: true });
      })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [navigate]);

  async function handleLogout() {
    try { await api.post("/user/logout"); } catch { /* Clear local session even if cookie logout is unavailable. */ }
    sessionStorage.removeItem("learnhub_token");
    navigate("/admin/login", { replace: true });
  }

  if (checking) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking administrator session…</div>;
  if (!admin) return null;

  const nav = (
    <>
      <NavLink onClick={() => setMobileOpen(false)} to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-black text-white" : "text-slate-600 hover:bg-slate-100"}`}><LayoutDashboard size={18} /> Dashboard</NavLink>
      <NavLink onClick={() => setMobileOpen(false)} to="/admin/courses" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-black text-white" : "text-slate-600 hover:bg-slate-100"}`}><Library size={18} /> Manage courses</NavLink>
      <NavLink onClick={() => setMobileOpen(false)} to="/admin/messages" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-black text-white" : "text-slate-600 hover:bg-slate-100"}`}><Mail size={18} /> Contact messages</NavLink>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
        <Link to="/" className="mb-10 flex items-center gap-2 text-xl font-extrabold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white"><BookOpen size={19} /></span>Learn<span className="-ml-2 text-neutral-700">Hub</span></Link>
        <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</p>
        <nav className="space-y-2">{nav}</nav>
        <div className="mt-auto rounded-2xl bg-white-50 p-4"><ShieldCheck className="text-neutral-700" size={22} /><p className="mt-3 text-sm font-semibold text-slate-800">Administrator</p><p className="mt-1 break-all text-xs text-slate-500">{admin.email}</p></div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <button onClick={() => setMobileOpen((value) => !value)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Toggle navigation">{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <div className="hidden text-sm text-slate-500 lg:block">Learning platform / <span className="font-semibold text-slate-800">Admin</span></div>
          <div className="ml-auto flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{admin.name}</p><p className="text-xs text-slate-500">Administrator</p></div><button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-neutral-200 hover:text-neutral-700"><LogOut size={16} /><span className="hidden sm:inline">Logout</span></button></div>
        </header>
        {mobileOpen && <div className="border-b border-slate-200 bg-white p-4 lg:hidden"><nav className="space-y-2">{nav}</nav></div>}
        <main className="mx-auto max-w-7xl p-5 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
