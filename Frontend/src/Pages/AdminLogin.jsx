import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, ShieldCheck } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/user/login", form);
      if (!data.success || !data.token) throw new Error(data.message || "Login failed.");
      sessionStorage.setItem("learnhub_token", data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) { setError(getErrorMessage(err, "Unable to login.")); }
    finally { setLoading(false); }
  }

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white-50 via-white to-white-100 px-4 py-10"><div className="w-full max-w-md">
    <Link to="/" className="mb-8 flex flex-col items-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-neutral-200"><BookOpen size={28} /></span><span className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Learn<span className="text-neutral-700">Hub</span></span><span className="mt-1 text-xs tracking-wide text-slate-500">LEARN TODAY, LEAD TOMORROW</span></Link>
    <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-100 bg-white p-7 shadow-xl sm:p-9"><div className="mb-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white-50 text-neutral-700"><ShieldCheck size={28} /></div><h1 className="mt-4 text-2xl font-extrabold text-slate-900">Admin Login</h1><p className="mt-2 text-sm text-slate-500">Sign in to manage your LearnHub courses.</p></div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-neutral-200 bg-white-50 px-4 py-3 text-sm text-neutral-700">{error}</div>}
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="admin-email">Email address</label><input id="admin-email" type="email" required autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="admin@example.com" className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-neutral-500 focus:bg-white focus:ring-4 focus:ring-neutral-50" />
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="admin-password">Password</label><div className="relative"><input id="admin-password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-neutral-500 focus:bg-white focus:ring-4 focus:ring-neutral-50" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      <button disabled={loading} className="mt-7 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-neutral-200 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in…" : "Sign in to dashboard"}</button>
      <p className="mt-5 text-center text-xs text-slate-400">Secure administrator access only</p>
    </form>
    <p className="mt-6 text-center text-sm text-slate-500">First time setup? <Link to="/admin/register" className="font-bold text-neutral-700 hover:text-neutral-800">Create admin account</Link></p><p className="mt-4 text-center"><Link to="/" className="text-sm text-slate-500 hover:text-neutral-700">← Back to website</Link></p>
  </div></div>;
}
