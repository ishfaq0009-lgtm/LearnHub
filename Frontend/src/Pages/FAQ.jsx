import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

const questions = [
  {
    question: "How do I explore available courses?",
    answer: "Open the Courses page from the navigation bar. You can browse the available courses and open any course to read its details and curriculum.",
  },
  {
    question: "Do I need an account to view courses?",
    answer: "No. You can visit the public pages and explore the course catalogue without signing in.",
  },
  {
    question: "How can I get help or ask a question?",
    answer: "Visit the Contact page, complete the form with your details and message, then submit it. The LearnHub team can review your enquiry.",
  },
  {
    question: "How can I become a LearnHub administrator?",
    answer: "Administrator access is intended for authorized platform managers. Use the Admin link only if you have the appropriate account credentials.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white text-black">
      <PublicHeader />
      <main>
        <section className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <CircleHelp size={27} />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-neutral-500">Help center</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Frequently asked questions</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-700">
              Quick answers to common questions about exploring LearnHub and getting in touch.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {questions.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <article key={item.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 text-left"
                  >
                    <span className="text-base font-bold leading-7 text-black">{item.question}</span>
                    <ChevronDown className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} size={20} />
                  </button>
                  {isOpen && <p className="max-w-2xl pt-4 pr-8 text-sm leading-7 text-neutral-700">{item.answer}</p>}
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
