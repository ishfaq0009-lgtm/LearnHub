import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

export default function NotFound() {
  return <div className="flex min-h-screen flex-col bg-slate-50"><PublicHeader /><main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center"><p className="text-6xl font-black text-neutral-700">404</p><h1 className="mt-5 text-2xl font-extrabold text-slate-900">Page not found</h1><p className="mt-3 text-sm text-slate-500">The page you are looking for may have moved or no longer exists.</p><Link to="/" className="mt-7 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800">Back to home</Link></main><Footer /></div>;
}
