import { Link } from "react-router-dom";
import { BookOpen, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_.8fr_1fr] md:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-2xl font-black tracking-tight">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white text-black">
              <BookOpen size={22} />
            </span>
            LearnHub<span className="text-neutral-500">.</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
            Discover practical courses, build valuable skills and take the next step towards your goals.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.16em] text-white">Explore</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-neutral-400">
            <Link className="transition hover:text-white" to="/">Home</Link>
            <Link className="transition hover:text-white" to="/courses">All courses</Link>
            <Link className="transition hover:text-white" to="/about">About LearnHub</Link>
            <Link className="transition hover:text-white" to="/faq">FAQs</Link>
            <Link className="transition hover:text-white" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.16em] text-white">Have a question?</h3>
          <a href="mailto:info@learnhub.com" className="mt-5 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white">
            <Mail size={16} /> info@learnhub.com <ArrowUpRight size={14} />
          </a>
          <p className="mt-3 text-xs leading-6 text-neutral-500">For course enquiries and platform support.</p>
        </div>
      </div>
      <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} LearnHub. All rights reserved. <span className="mx-2">·</span> Learn today, lead tomorrow.
      </div>
    </footer>
  );
}
