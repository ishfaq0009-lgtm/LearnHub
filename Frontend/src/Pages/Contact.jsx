import { useState } from "react";
import { CheckCircle2, Mail, MessageCircle, ShieldCheck, Send, Phone, MapPin } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import api, { getErrorMessage } from "../lib/api";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-50";

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, subject and message.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/contact", form);
      setSuccess(data.message || "Your message has been sent successfully.");
      setForm(initialForm);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Your message could not be sent. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <main>
        <section className="bg-gradient-to-br from-slate-950 via-neutral-950 to-black px-6 py-16 text-white md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold tracking-[.2em] text-neutral-300">WE ARE HERE TO HELP</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Let’s start a conversation.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-100 sm:text-base">Have a question about a course or need help with LearnHub? Send us a message and our team will get back to you.</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:px-10 lg:grid-cols-[.72fr_1.28fr] lg:py-16">
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white-50 text-neutral-700"><MessageCircle size={23} /></div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">Get in touch</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Share your question with us. Please provide enough detail so we can help you faster.</p>
              <div className="mt-7 space-y-5">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-neutral-700"><Mail size={18} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p><p className="mt-1 text-sm font-semibold text-slate-800">info@learnhub.com</p></div></div>
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-neutral-700"><Phone size={18} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p><p className="mt-1 text-sm font-semibold text-slate-800">Add your support number</p></div></div>
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-neutral-700"><MapPin size={18} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Platform</p><p className="mt-1 text-sm font-semibold text-slate-800">Learn from anywhere</p></div></div>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white-50 p-6"><h3 className="font-bold text-neutral-950">A quick tip</h3><p className="mt-2 text-sm leading-6 text-neutral-800">If your question is about a specific course, include its name in the subject or message.</p></div>
          </aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">Contact form</p><h2 className="mt-2 text-2xl font-extrabold text-slate-900">Send us a message</h2><p className="mt-2 text-sm text-slate-500">Fields marked with * are required.</p></div>
            {success && <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-800"><CheckCircle2 className="mt-0.5 shrink-0" size={18} />{success}</div>}
            {error && <div role="alert" className="mb-5 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-700">Full name *</label><input id="contact-name" name="name" value={form.name} onChange={updateField} required maxLength={80} autoComplete="name" placeholder="Your name" className={inputClass} /></div>
                <div><label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address *</label><input id="contact-email" name="email" type="email" value={form.email} onChange={updateField} required maxLength={254} autoComplete="email" placeholder="you@example.com" className={inputClass} /></div>
                <div><label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label><input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={updateField} maxLength={30} autoComplete="tel" placeholder="Your phone (optional)" className={inputClass} /></div>
                <div><label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-slate-700">Subject *</label><input id="contact-subject" name="subject" value={form.subject} onChange={updateField} required maxLength={120} placeholder="How can we help?" className={inputClass} /></div>
              </div>
              <div><label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-700">Message *</label><textarea id="contact-message" name="message" value={form.message} onChange={updateField} required minLength={10} maxLength={3000} rows={6} placeholder="Write your message here..." className={`${inputClass} resize-y`} /><p className="mt-1 text-right text-xs text-slate-400">{form.message.length}/3000</p></div>
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-slate-400">Your message is sent securely and stored for our admin team.</p><button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"><Send size={16} />{loading ? "Sending message..." : "Send message"}</button></div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
