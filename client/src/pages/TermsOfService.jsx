import React from "react";
import { motion } from "framer-motion";
import { Scale, AlertCircle, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[3rem] border border-slate-200 shadow-xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8">
            <Scale size={14} />
            Legal Agreement
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-slate-900 mb-12">
            Terms of <span className="text-blue-600">Service.</span>
          </h1>

          <div className="space-y-12 text-slate-600 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                1. Educational Nature
              </h2>
              <p>
                MetaFlow is an EdTech ecosystem. All sessions, materials, and
                roadmaps are for **educational purposes only**. We provide the
                tools and direction; however, the execution and subsequent
                results are the sole responsibility of the user.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                2. No Earnings Guarantee
              </h2>
              <div className="p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-2xl italic">
                "We do not make guarantees regarding income, profit, or specific
                financial outcomes. Individual success depends on market
                conditions, individual effort, and consistency."
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                3. User Conduct
              </h2>
              <p>
                Users agree to interact with mentors and the community with
                professional decorum. Any form of harassment, distribution of
                proprietary course material, or misuse of the platform will
                result in immediate termination of access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                4. Intellectual Property
              </h2>
              <p>
                All content, including frameworks, videos, and strategy
                documents, are the intellectual property of MetaFlow.
                Unauthorized reproduction or distribution is strictly
                prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                5. Refunds & Cancellations
              </h2>
              <p>
                Due to the digital and consultative nature of our services,
                refund policies are governed by the specific program selected at
                the time of purchase. Strategy session fees are generally
                non-refundable once the session has been conducted.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
