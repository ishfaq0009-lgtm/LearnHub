import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, RefreshCw, Search, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/contact/admin/messages", { params: { status, search } });
      setMessages(data.messages || []);
      setUnread(data.unread || 0);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Could not load contact messages."));
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const timer = window.setTimeout(loadMessages, 250);
    return () => window.clearTimeout(timer);
  }, [loadMessages]);

  async function toggleRead(message) {
    setBusyId(message._id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch(`/api/contact/admin/messages/${message._id}/read`, { isRead: !message.isRead });
      setMessages((current) => {
        if ((status === "unread" && data.contactMessage.isRead) || (status === "read" && !data.contactMessage.isRead)) {
          return current.filter((item) => item._id !== message._id);
        }
        return current.map((item) => item._id === message._id ? data.contactMessage : item);
      });
      setUnread((count) => Math.max(0, count + (message.isRead ? 1 : -1)));
      setNotice(data.message);
    } catch (actionError) {
      setError(getErrorMessage(actionError, "Could not update this message."));
    } finally {
      setBusyId("");
    }
  }

  async function deleteMessage(message) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setBusyId(message._id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.delete(`/api/contact/admin/messages/${message._id}`);
      setMessages((current) => current.filter((item) => item._id !== message._id));
      if (!message.isRead) setUnread((count) => Math.max(0, count - 1));
      setNotice(data.message);
    } catch (actionError) {
      setError(getErrorMessage(actionError, "Could not delete this message."));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-neutral-700">Inbox</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Contact messages</h1><p className="mt-2 text-sm text-slate-500">Read and manage messages sent through the public contact form.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><Mail size={17} className="text-neutral-700" /><span className="font-semibold text-slate-800">{unread} unread</span></div>
      </div>

      {error && <div role="alert" className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{error}</div>}
      {notice && <div role="status" className="mt-6 rounded-xl border border-neutral-200 bg-white-50 p-4 text-sm text-neutral-700">{notice}</div>}

      <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"><Search size={17} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or subject" className="w-full text-sm outline-none" /></div>
          <div className="flex items-center gap-2"><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-neutral-500"><option value="all">All messages</option><option value="unread">Unread</option><option value="read">Read</option></select><button onClick={loadMessages} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={16} /> Refresh</button></div>
        </div>

        {loading ? <div className="space-y-3 p-6"><div className="h-24 animate-pulse rounded-xl bg-slate-100" /><div className="h-24 animate-pulse rounded-xl bg-slate-100" /></div> : messages.length ? (
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <article key={message._id} className={`p-5 md:p-6 ${message.isRead ? "bg-white" : "bg-white-50/40"}`}>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{message.subject}</h2>{!message.isRead && <span className="rounded-full bg-white-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-700">New</span>}</div>
                    <p className="mt-1 text-sm text-slate-600">{message.name} <span className="text-slate-300">·</span> <a href={`mailto:${message.email}`} className="font-medium text-neutral-700 hover:underline">{message.email}</a>{message.phone && <span className="text-slate-500"> <span className="text-slate-300">·</span> {message.phone}</span>}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button disabled={busyId === message._id} onClick={() => toggleRead(message)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-neutral-200 hover:text-neutral-700 disabled:opacity-50">{message.isRead ? <Mail size={14} /> : <MailOpen size={14} />}{message.isRead ? "Mark unread" : "Mark read"}</button>
                    <button disabled={busyId === message._id} onClick={() => deleteMessage(message)} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-white px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-white-50 disabled:opacity-50"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-white p-4 text-sm leading-7 text-slate-700">{message.message}</p>
              </article>
            ))}
          </div>
        ) : <div className="px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white-50 text-neutral-700"><Mail size={22} /></div><h2 className="mt-4 font-bold text-slate-900">No messages found</h2><p className="mt-2 text-sm text-slate-500">{search || status !== "all" ? "Try changing your search or filter." : "Messages sent from the Contact page will appear here."}</p></div>}
      </div>
    </div>
  );
}
