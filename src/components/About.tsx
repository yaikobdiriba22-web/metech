import React, { useState } from "react";
import {
  CheckCircle2,
  Bot,
  UserCheck,
  Code2,
  Briefcase,
  Award,
  Infinity as InfinityIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface AboutProps {
  onOpenAITutor: () => void;
  onExploreCourses: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenAITutor, onExploreCourses }) => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "AI Learning Assistant",
      desc: "Instant code reviews, 24/7 AI tutoring, and auto-generated quizzes tailored to your progress.",
      icon: Bot,
    },
    {
      title: "Expert Instructors",
      desc: "Learn directly from senior software architects and creative directors from Google, Meta, and AWS.",
      icon: UserCheck,
    },
    {
      title: "Hands-on Projects",
      desc: "Build real-world full-stack SaaS applications, design systems, and cloud architectures for your portfolio.",
      icon: Code2,
    },
    {
      title: "Career Mentorship",
      desc: "Get 1-on-1 resume reviews, mock interview simulations, and referral networks.",
      icon: Briefcase,
    },
    {
      title: "Certificates",
      desc: "Earn shareable, verified digital certificates accepted by top employers globally.",
      icon: Award,
    },
    {
      title: "Lifetime Access",
      desc: "Pay once or subscribe to access updated course modules and community forums forever.",
      icon: InfinityIcon,
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Student Image with Glassmorphism Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden p-3 bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-transparent border border-emerald-500/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"
                alt="Student learning at Yacob Tech Academy"
                className="w-full h-[450px] sm:h-[520px] object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />

              {/* Glassmorphic Overlay Badge 1 */}
              <div className="absolute top-8 right-8 p-4 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl border border-white/50 dark:border-gray-800 shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Structured Career Tracks</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Zero to Senior Engineer</p>
                  </div>
                </div>
              </div>

              {/* Glassmorphic Overlay Badge 2 */}
              <div className="absolute bottom-8 left-8 p-4 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md rounded-2xl border border-white/50 dark:border-gray-800 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-extrabold text-sm">
                    99%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Satisfaction Rate</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Headline & Features List */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>About Our Academy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Why Learn With <span className="text-emerald-600 dark:text-emerald-400">Yacob Tech Academy?</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              We bridge the gap between traditional learning and modern tech requirements. With our state-of-the-art AI Tutor, industry-curated curriculum, and real-world project reviews, you don't just learn concepts—you build career-defining projects.
            </p>

            {/* Features Checklist */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      activeTab === idx
                        ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10"
                        : "bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/60 dark:border-gray-800/60 hover:border-emerald-300 dark:hover:border-emerald-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenAITutor}
                className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                Experience AI Tutor
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCourses}
                className="px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Browse Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
