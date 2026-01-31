import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            Data Protection
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-slate-900">
            Privacy <span className="text-blue-600">Policy.</span>
          </h1>

          <p className="text-slate-500 font-medium italic">Last Updated: October 2023</p>

          <hr className="border-slate-100" />

          <div className="space-y-12 text-slate-600 leading-relaxed text-lg">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">1. Information Collection</h2>
              <p>
                At MetaFlow, we collect information necessary to provide mentorship and educational services. This includes personal identifiers (name, email) and professional goals shared during strategy sessions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">2. Use of Data</h2>
              <p>Your data is utilized solely for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personalizing your learning roadmap.</li>
                <li>Scheduling and managing one-on-one strategy sessions.</li>
                <li>Sending updates regarding platform changes or new modules.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">3. Data Security</h2>
              <p>
                We implement industry-standard encryption to protect your information. As a government-registered entity, we adhere to strict data handling protocols to prevent unauthorized access or disclosure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">4. Third-Party Sharing</h2>
              <p>
                MetaFlow does not sell or lease user data to third-party marketers. Data is only shared with essential service providers (like payment processors or scheduling tools) required to fulfill our service to you.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;