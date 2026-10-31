import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, Menu, ShieldCheck, X } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
    }`;
  const mobileLinkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"
    }`;

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <BookOpen size={20} strokeWidth={2.2} />
          </span>
          <span className="text-xl font-black tracking-tight text-black">LearnHub<span className="text-neutral-400">.</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/admin/login" className="hidden items-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-bold text-black transition hover:border-black hover:bg-neutral-50 sm:inline-flex">
            <ShieldCheck size={16} /> Admin
          </Link>
          <Link to="/courses" className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800 sm:inline-flex">
            Explore courses
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="rounded-xl border border-neutral-200 p-2.5 text-black hover:bg-neutral-100 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-5 py-4 shadow-lg md:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <NavLink key={link.to} onClick={closeMenu} to={link.to} end={link.end} className={mobileLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <Link onClick={closeMenu} to="/admin/login" className="mt-2 inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-bold text-black">
              <ShieldCheck size={16} /> Admin login
            </Link>
            <Link onClick={closeMenu} to="/courses" className="mt-1 rounded-xl bg-black px-4 py-3 text-center text-sm font-bold text-white">
              Explore courses
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
