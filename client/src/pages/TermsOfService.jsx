import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, TrendingUp } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const sections = [
  {
    title: "1. Educational Nature",
    body: "TalkWithKartik is an EdTech ecosystem. All sessions, materials, and roadmaps are for educational purposes only. We provide tools and direction, while execution and results remain the responsibility of the user.",
  },
  {
    title: "2. No Earnings Guarantee",
    body: "We do not guarantee income, profit, or specific financial outcomes. Individual success depends on market conditions, personal effort, consistency, and execution quality.",
    highlight: true,
  },
  {
    title: "3. User Conduct",
    body: "Users agree to interact with mentors and the community professionally. Harassment, unauthorized distribution of proprietary material, or misuse of the platform may result in termination of access.",
  },
  {
    title: "4. Intellectual Property",
    body: "All content, frameworks, videos, and strategy documents are the intellectual property of TalkWithKartik. Unauthorized reproduction or distribution is strictly prohibited.",
  },
  {
    title: "5. Refunds & Cancellations",
    body: "Due to the digital and consultative nature of our services, refund policies are governed by the specific program selected at purchase. Strategy session fees are generally non-refundable once the session has been conducted.",
  },
];

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <TrendingUp size={19} />
            </span>
            <span className="text-lg font-black tracking-tight">
              TalkWith<span className="text-blue-600">Kartik</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-blue-700">
            <Scale size={15} />
            Legal Agreement
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Please read these terms before using TalkWithKartik services,
            sessions, content, or educational resources.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className={`rounded-lg border p-5 sm:p-6 ${
                section.highlight
                  ? "border-blue-100 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h2 className="text-lg font-black text-slate-950">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            © 2026 TalkWithKartik
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-500">
            <NavLink to="/privacy-policy" className="hover:text-blue-600">
              Privacy
            </NavLink>
            <NavLink to="/term-of-service" className="hover:text-blue-600">
              Terms
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
