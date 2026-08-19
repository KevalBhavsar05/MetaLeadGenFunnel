import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Send,
  ShieldCheck,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import ScheduleModal from "@/components/common/ScheduleModal";
import Profile from "../assets/Profile.jpg";
import { toast } from "sonner";
import { useSubmitFeedback } from "@/hooks/useFeedback";

const whatsappLink =
  "https://wa.me/919876543210?text=Hello%20Sir%2FMadam%2C%20could%20you%20please%20share%20the%20meeting%20link%20for%20the%20session%3F";

const WhatsAppIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M16.04 3C8.86 3 3.02 8.82 3.02 15.98c0 2.29.6 4.53 1.74 6.5L3 29l6.69-1.75a13.05 13.05 0 0 0 6.35 1.62h.01c7.18 0 13.02-5.82 13.02-12.98C29.07 8.82 23.23 3 16.04 3Zm0 23.67h-.01c-1.9 0-3.77-.51-5.4-1.47l-.39-.23-3.97 1.04 1.06-3.86-.25-.4a10.72 10.72 0 0 1-1.65-5.77c0-5.95 4.86-10.79 10.84-10.79 2.89 0 5.61 1.12 7.66 3.16a10.72 10.72 0 0 1 3.17 7.64c0 5.95-4.86 10.79-10.83 10.79Zm5.94-8.08c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.25-.71.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.14.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.71 0 1.6 1.17 3.15 1.33 3.37.16.22 2.31 3.51 5.59 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z" />
  </svg>
);

const sessionSteps = [
  {
    icon: ShieldCheck,
    title: "Review",
    desc: "We understand your goals, current skill level, and where you need the most clarity.",
  },
  {
    icon: Users,
    title: "Alignment",
    desc: "We match your direction with suitable programs, tools, workflows, and realistic next steps.",
  },
  {
    icon: CheckCircle2,
    title: "Action Plan",
    desc: "You leave with a focused plan for learning, execution, and measurable progress.",
  },
];

const stats = [
  { value: "5L+", label: "Learners impacted" },
  { value: "20K", label: "Event audience" },
  { value: "15+", label: "Entrepreneurs" },
  { value: "1:1", label: "Guidance" },
];

const testimonials = [
  {
    name: "Pragya Singh",
    text: "IDigitalPreneur is an excellent e-learning platform that delivers great skill development and growth. Over the past 5 months, I have learned valuable skills like public speaking, Instagram growth, and digital marketing. The training is well-structured and the mentorship is incredibly supportive. I highly recommend it to anyone seeking financial independence and skill enhancement",
  },
  {
    name: "Riya Sandhu",
    text: "Joining iDigitalPreneur has been truly transformative for me.The structured training and constant mentorship helped me build confidence and improve my communication skills.I gained valuable professional skills along with personal growth. Grateful to be part of such a supportive and inspiring community.",
  },
  {
    name: "Dhananjay Chaurasiya",
    text: "My experience with iDigitalPreneur has been extremely positive. It’s a transparent and 100% legit platform that truly delivers on its promises. The beginner-friendly, well-structured training and strong support system helped me learn digital marketing, ads, public speaking, and more. I highly recommend it to anyone serious about building a successful digital career.",
  },
];

const AffiliateMarketingLandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const submitFeedback = useSubmitFeedback();
  const [feedback, setFeedback] = useState({
    name: "",
    rating: 5,
    message: "",
  });

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
    try {
      await submitFeedback.mutateAsync(feedback);
      toast.success("Thank you for sharing your feedback");
      setFeedback({ name: "", rating: 5, message: "" });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to submit feedback. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <TrendingUp size={19} />
            </span>
            <span className="text-lg font-black tracking-tight sm:text-xl">
              TalkWith<span className="text-blue-600">Kartik</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 md:flex">
            <a href="#session" className="transition hover:text-blue-600">
              Strategy
            </a>
            <a href="#about" className="transition hover:text-blue-600">
              Mentor
            </a>
            <a href="#testimonials" className="transition hover:text-blue-600">
              Results
            </a>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="hidden h-11 cursor-pointer rounded-lg bg-blue-600 px-5 font-bold text-white hover:bg-blue-700 sm:flex"
          >
            Book Session
            <ExternalLink size={16} />
          </Button>
        </div>
      </nav>

      <main>
        <section className="border-b border-slate-200 bg-slate-50 px-5 pb-14 pt-28 sm:px-6 lg:pb-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-blue-700">
                <Award size={15} />
                Guided strategy session
              </div>

              <h1 className="text-4xl font-black uppercase leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                Learn Skills.
                <span className="block text-blue-600">Build Direction.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                A focused one-on-one session for learners who want practical
                skill direction, program clarity, and a realistic action plan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="h-13 cursor-pointer rounded-lg bg-blue-600 px-7 text-base font-black text-white hover:bg-blue-700"
                >
                  Book Session
                  <ArrowRight size={18} />
                </Button>
              </div>

              {/* <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <p className="text-2xl font-black text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Session Preview
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    Practical roadmap overview
                  </p>
                </div>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                  Watch
                </span>
              </div>
              <div className="aspect-video bg-slate-950">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/fzUBVFjsod8?si=lWVJRC98SSQdzE2I"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="session" className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                A simple session built around clarity.
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-5 md:grid-cols-3">
                {sessionSteps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.title}
                      className="rounded-lg border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Icon size={21} />
                        </span>
                        <span className="text-xs font-black text-slate-300">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {item.desc}
                      </p>
                    </Card>
                  );
                })}
              </div>

              <Card className="rounded-lg border-blue-100 bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
                  <Calendar size={23} />
                </div>
                <h3 className="mt-7 text-2xl font-black uppercase tracking-tight">
                  Schedule a Call
                </h3>
                <p className="mt-3 text-sm leading-6 text-blue-50">
                  Introductory sessions are limited so each conversation stays
                  focused, personal, and useful.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-7 h-12 w-full cursor-pointer rounded-lg bg-white font-black uppercase text-blue-700 hover:bg-blue-50"
                >
                  Schedule Strategy Session
                </Button>
                <p className="mt-4 text-xs leading-5 text-blue-100">
                  Educational and strategic guidance only. Results depend on
                  individual effort and execution.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-slate-200 bg-slate-50 px-5 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="relative">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <img
                  src={Profile}
                  alt="Mentor profile"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Award size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-slate-950">
                      Mentor-led learning
                    </p>
                    <p className="text-xs text-slate-500">
                      Practical guidance with structured direction.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                Company overview
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                A purpose-driven EdTech ecosystem.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-slate-600">
                <p>
                  This government-registered EdTech platform focuses on
                  practical skill-building, execution clarity, and long-term
                  learner growth.
                </p>
                <p>
                  Alongside technical skills, mindset development is treated as
                  a foundation because sustainable progress depends on clarity,
                  discipline, and consistency.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="rounded-lg border-slate-200 bg-white p-6 shadow-sm">
                  <Users className="mb-4 text-blue-600" size={25} />
                  <h3 className="text-lg font-black text-slate-950">
                    Leadership & Credibility
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Trainers include TEDx speakers, bringing real-world
                    exposure into the learning process.
                  </p>
                </Card>

                <Card className="rounded-lg border-slate-200 bg-white p-6 shadow-sm">
                  <TrendingUp className="mb-4 text-blue-600" size={25} />
                  <h3 className="text-lg font-black text-slate-950">
                    Impact at Scale
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Over 5 lakh learners have benefited through structured
                    training, guidance, and events.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                Learner results
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                What learners say.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <Card
                  key={item.name}
                  className="flex min-h-[270px] flex-col justify-between rounded-lg border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="mb-5 flex gap-1 text-blue-500">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} fill="currentColor" size={15} />
                      ))}
                    </div>
                    <p className="text-base leading-7 text-slate-600">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <User size={21} className="text-blue-600" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">
                      {item.name}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                Feedback
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Tell us how the page feels.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Your feedback helps us improve the session experience, page
                clarity, and booking flow for future learners.
              </p>
            </div>

            <Card className="rounded-lg border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <MessageSquare size={21} />
                  </span>
                  <div>
                    <h3 className="font-black text-slate-950">
                      Share Feedback
                    </h3>
                    <p className="text-sm text-slate-500">
                      A quick note is enough.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Name
                    </label>
                    <input
                      type="text"
                      value={feedback.name}
                      onChange={(event) =>
                        setFeedback({ ...feedback, name: event.target.value })
                      }
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Rating
                    </label>
                    <div className="flex h-12 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedback({ ...feedback, rating })}
                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition ${feedback.rating >= rating
                              ? "text-blue-600"
                              : "text-slate-300 hover:text-blue-300"
                            }`}
                          aria-label={`${rating} star rating`}
                        >
                          <Star size={18} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    Message
                  </label>
                  <textarea
                    required
                    value={feedback.message}
                    onChange={(event) =>
                      setFeedback({ ...feedback, message: event.target.value })
                    }
                    placeholder="What should we improve?"
                    rows={5}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    Feedback is used only to improve the page and session
                    experience.
                  </p>
                  <Button
                    type="submit"
                    disabled={submitFeedback.isPending}
                    className="h-11 cursor-pointer rounded-lg bg-blue-600 px-6 font-black text-white hover:bg-blue-700"
                  >
                    {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
                    <Send size={15} />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 px-5 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <TrendingUp size={19} />
            </span>
            <span className="text-xl font-black tracking-tight">
              TalkWith<span className="text-blue-400">Kartik</span>
            </span>
          </div>

          <p className="max-w-xl text-xs font-medium uppercase leading-6 tracking-widest text-slate-400">
            Education, mentorship, and skill-based guidance. Outcomes depend on
            individual effort, discipline, and execution.
          </p>

          <div className="flex gap-7 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <NavLink to="/privacy-policy" className="transition hover:text-white">
              Privacy
            </NavLink>
            <NavLink to="/term-of-service" className="transition hover:text-white">
              Terms
            </NavLink>
          </div>
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition hover:-translate-y-1 hover:bg-[#1fbd5a] focus:outline-none focus:ring-4 focus:ring-emerald-200"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AffiliateMarketingLandingPage;

