import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, TrendingUp } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const sections = [
  {
    title: "1. Information Collection",
    body: "We collect information necessary to provide mentorship and educational services. This may include your name, email, phone number, scheduling details, and goals shared during strategy sessions.",
  },
  {
    title: "2. Use of Data",
    body: "Your data is used to personalize your learning roadmap, schedule and manage one-on-one strategy sessions, send relevant updates, and improve the platform experience.",
  },
  {
    title: "3. Data Security",
    body: "We take reasonable technical and organizational measures to protect your information from unauthorized access, misuse, disclosure, or alteration.",
  },
  {
    title: "4. Third-Party Sharing",
    body: "TalkWithKartik does not sell or lease user data to third-party marketers. Information may be shared only with essential service providers needed to deliver scheduling, communication, or platform services.",
  },
];

const PrivacyPolicy = () => {
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
            <ShieldCheck size={15} />
            Data Protection
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            This policy explains how we collect, use, and protect information
            submitted through TalkWithKartik.
          </p>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">
            Last updated: October 2023
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
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

export default PrivacyPolicy;
