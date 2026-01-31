import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  ArrowRight,
  TrendingUp,
  Play,
  Calendar,
  Star,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import ScheduleModal from "@/components/common/ScheduleModal";
import Profile from "../assets/Profile.jpg";
import { Link, NavLink } from "react-router-dom";
/* =======================
   MAIN PAGE
======================= */
const AffiliateMarketingLandingPage = () => {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]
  );
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.05)"]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">
      <motion.nav
        style={{
          backgroundColor: background,
          backdropFilter: "blur(12px)",
          borderColor: border,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all h-20 flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Meta<span className="text-blue-600">Flow</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
            <a href="#schedule" className="hover:text-blue-600 transition">
              Strategy
            </a>
            <a href="#about" className="hover:text-blue-600 transition">
              Mentor
            </a>
            <a href="#testimonials" className="hover:text-blue-600 transition">
              Results
            </a>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 px-6 font-bold"
          >
            Book Session
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </div>
      </motion.nav>
      );
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* 1. HERO SECTION & VIDEO */}
      <section className="relative pt-20 md:pt-30 pb-32 px-6">
        {/* Soft Blue Radial Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              <h1
                className="
        text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
        font-black leading-[1] sm:leading-[0.95]
        tracking-tighter uppercase text-slate-900
      "
              >
                Learn Skills. <br />
                <span className="text-blue-600">Build Direction.</span> <br />
                Execute <br />
                <span className="text-slate-300">With Clarity.</span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 leading-relaxed">
                A government-registered EdTech ecosystem focused on practical
                skill-building, execution clarity, and long-term earning through
                structured guidance.
              </p>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="
          h-14 sm:h-16 px-8 sm:px-10
          w-full sm:w-auto
          bg-blue-600 hover:bg-blue-700
          rounded-2xl text-base sm:text-lg
          text-white font-bold cursor-pointer
          shadow-xl shadow-blue-500/20
          flex items-center justify-center
        "
              >
                Book Session
                <ArrowRight className="ml-2" />
              </Button>
            </motion.div>

            {/* RIGHT PREVIEW CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group cursor-pointer max-w-xl mx-auto lg:max-w-none"
            >
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-blue-500/15 transition" />
              <div className="relative aspect-[4/3] rounded-[2.5rem] bg-slate-100 border border-slate-200 p-3 shadow-2xl">
                <div className="w-full h-full rounded-[2rem] bg-white overflow-hidden flex flex-col border border-slate-200 shadow-inner">
                  {/* HEADER */}
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                      <div className="w-3 h-3 rounded-full bg-slate-200" />
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      System Preview
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center text-center space-y-3 sm:space-y-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                      <Play fill="white" className="ml-1 text-white" />
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                      WATCH LEARNING SYSTEM WALKTHROUGH
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400">
                      Program Overview • Real Use-Cases
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* 2. SCHEDULE & BENEFITS */}
      <section
        id="schedule"
        className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center 
                    p-6 sm:p-10 md:p-14 lg:p-20 
                    rounded-3xl sm:rounded-[3rem] lg:rounded-[4rem] 
                    bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            {/* LEFT CONTENT */}
            <div className="space-y-10 sm:space-y-12">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl 
                       font-black uppercase tracking-tighter text-slate-900 leading-tight"
              >
                The Learning & Direction <br />
                <span className="text-blue-600">Session</span>
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {[
                  {
                    title: "Review",
                    desc: "We analyze your current goals, experience level, and traffic sources to understand where you are starting from.",
                  },
                  {
                    title: "Alignment",
                    desc: "We discuss suitable programs, tools, and workflows based on your niche and long-term objectives.",
                  },
                  {
                    title: "Action Plan",
                    desc: "You leave with a clear, step-by-step plan focused on sustainable growth and measurable next steps.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 sm:gap-6 items-start group"
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 
                              rounded-xl sm:rounded-2xl 
                              bg-blue-50 border border-blue-100 
                              flex items-center justify-center 
                              text-blue-600 font-bold 
                              group-hover:bg-blue-600 group-hover:text-white transition-all"
                    >
                      {i + 1}
                    </div>

                    <div>
                      <h4
                        className="font-bold text-base sm:text-lg md:text-xl 
                               uppercase tracking-tight text-slate-900"
                      >
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-light text-sm mt-1 max-w-md">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD */}
            <Card
              className="p-6 sm:p-8 md:p-10 
                       bg-slate-50 border-slate-200 
                       rounded-3xl text-center space-y-6 sm:space-y-8 
                       shadow-inner"
            >
              <div
                className="p-4 rounded-3xl text-blue-600 flex justify-center items-center 
                        bg-blue-50 border border-blue-100 
                        shadow-md shadow-blue-500/10 mx-auto"
              >
                <Calendar size={28} className="sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-2">
                <h3
                  className="text-lg sm:text-xl md:text-2xl 
                         font-bold uppercase tracking-widest text-slate-900"
                >
                  Schedule a Call
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm px-2">
                  Introductory sessions are limited to ensure focused,
                  one-on-one guidance.
                </p>
              </div>

              <Button
                className="w-full h-14 sm:h-16
                     bg-blue-600 text-white hover:bg-blue-700 
                     rounded-2xl sm:text-lg 
                     font-black uppercase
                     shadow-lg shadow-blue-500/20
                     cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                Schedule Strategy Session
              </Button>

              {/* Compliance Note */}
              <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed px-2">
                This session is educational and strategic in nature. No
                guarantees or earnings claims are made.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* 3. ABOUT MENTOR & COMPANY */}
      <section id="about" className="py-28 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            {/* LEFT : PROFILE IMAGE */}
            <div className="lg:col-span-2 relative">
              <div className="relative w-full aspect-[4/5] rounded-[3rem] border border-slate-200 p-2 bg-white shadow-2xl">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                  <img
                    src={Profile}
                    alt="Mentor Profile"
                    className="w-full h-full object-cover grayscale transition duration-700 hover:grayscale-0"
                  />
                </div>

                <div className="absolute -bottom-6 -right-6 p-6 bg-blue-600 rounded-3xl text-white shadow-xl">
                  <Award size={32} />
                </div>
              </div>
            </div>

            {/* RIGHT : COMPANY CONTENT */}
            <div className="lg:col-span-3 space-y-12">
              {/* HEADER */}
              <div className="space-y-6">
                <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
                  Company Overview
                </span>

                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                  A Purpose-Driven <br />
                  <span className="text-blue-600">EdTech Ecosystem</span>
                </h2>

                <p className="text-lg text-slate-600 leading-relaxed">
                  This is a government-registered EdTech platform built with a
                  clear purpose and long-term vision. The focus is on teaching
                  high-demand, market-relevant skills with strong emphasis on
                  practical execution rather than unnecessary theory.
                </p>

                <p className="text-lg text-slate-600 leading-relaxed">
                  Alongside technical skill-building, mindset development is
                  treated as a foundation — recognizing that sustainable earning
                  depends on clarity, discipline, and consistency.
                </p>
              </div>

              {/* INFO CARDS */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Leadership & Credibility
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Trainers associated with the platform include TEDx speakers,
                    bringing real-world exposure into the learning process. The
                    founder,{" "}
                    <span className="font-semibold text-slate-900">
                      Ashutosh Pratishat
                    </span>
                    , has shared the stage twice at TEDx and once at Josh Talks.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    Impact at Scale
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Over{" "}
                    <span className="font-semibold text-slate-900">
                      5 lakh+
                    </span>{" "}
                    individuals have already benefited. In 2023, the{" "}
                    <span className="font-semibold">Ashtitva</span> mega-event
                    brought together 15+ entrepreneurs and 20,000 learners on
                    one stage.
                  </p>
                </div>
              </div>

              {/* STATS */}
              {/* <div className="grid grid-cols-3 gap-6 pt-6">
                                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center">
                                    <p className="text-3xl font-black text-blue-600">5L+</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
                                        Lives Impacted
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center">
                                    <p className="text-3xl font-black text-slate-900">15+</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
                                        Entrepreneurs
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center">
                                    <p className="text-3xl font-black text-slate-900">20K</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
                                        Learners
                                    </p>
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </section>
      {/* 4. TESTIMONIALS */}
      <section id="testimonials" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Julian V.",
                res: "The structured roadmap helped me understand execution and skill application clearly.",
              },
              {
                name: "Elena M.",
                res: "This platform focuses on systems, discipline, and real implementation — not hype.",
              },
              {
                name: "Marcus T.",
                res: "For the first time, I received clarity on how skills translate into real opportunities.",
              },
            ].map((t, i) => (
              <Card
                key={i}
                className="p-10 bg-white border-slate-200 rounded-[3rem] space-y-6 hover:shadow-2xl hover:shadow-blue-500/10 transition duration-300"
              >
                <div className="flex gap-1 text-blue-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={12} />
                  ))}
                </div>
                <p className="text-lg text-slate-600 font-medium leading-relaxed italic">
                  "{t.res}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                    {t.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* 5. FOOTER */}
      <footer className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            <span className="text-xl font-bold text-slate-900 tracking-tighter">
              Meta<span className="text-blue-600">Flow</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center max-w-xl">
            This platform provides education, mentorship, and skill-based
            guidance. Outcomes depend on individual effort, discipline, and
            execution.
          </p>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <NavLink to={'/privacy-policy'} className="hover:text-blue-600 transition">
              Privacy
            </NavLink>
            <NavLink to={'/term-of-service'} className="hover:text-blue-600 transition">
              Terms
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateMarketingLandingPage;
