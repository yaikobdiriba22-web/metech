import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Star,
  Play,
  Mail,
  Bot,
  Compass,
  Send,
} from "lucide-react";

interface HeroProps {
  onStartLearning: () => void;
  onExploreCourses: () => void;
  onOpenAITutor: () => void;
  onOpenCareerRoadmap?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartLearning,
  onExploreCourses,
  onOpenAITutor,
  onOpenCareerRoadmap,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 2000);
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-900/10 via-emerald-50/40 to-white dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950"
    >
      {/* Background Decorative Gradient Circles & Abstract Shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-400/20 via-teal-300/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-teal-400/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Next-Gen EdTech with AI Tutor 2.0</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Upgrade Your Skills and Knowledge with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                AI-Powered
              </span>{" "}
              Online Learning
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Master Graphic Design, Programming, Artificial Intelligence, Video Editing,
              Web Development, Digital Marketing, and Business Skills through expert-led
              courses and an AI learning assistant.
            </p>

            {/* Email Signup Form */}
            <form onSubmit={handleSubscribe} className="pt-2 max-w-md">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-emerald-950/5">
                <div className="flex items-center gap-2 px-3 py-2 w-full">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-xs whitespace-nowrap shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  {subscribed ? "Subscribed! 🎉" : "Join Free"}
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCourses}
                className="px-7 py-3.5 rounded-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-800 font-semibold text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-emerald-500/50 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                Explore Courses
              </button>

              <button
                onClick={onOpenAITutor}
                className="px-5 py-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-emerald-500" />
                Try AI Tutor
              </button>

              {onOpenCareerRoadmap && (
                <button
                  onClick={onOpenCareerRoadmap}
                  className="px-5 py-3.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AI Career Roadmap
                </button>
              )}

              <a
                href="https://t.me/Yacob_Tech_Academy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all flex items-center justify-center hover:scale-105 shadow-xs"
                title="Telegram Group (t.me/Yacob_Tech_Academy)"
                aria-label="Telegram Group"
              >
                <Send className="w-4 h-4 text-sky-500 fill-sky-500/20" />
              </a>
            </div>

            {/* Statistics Bar */}
            <div className="pt-8 border-t border-gray-200/60 dark:border-gray-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">15K+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Students</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">500+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Expert Courses</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">98%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Completion Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Student Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual Section with Glassmorphism Overlay Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />

            {/* Main Student Image Card */}
            <div className="relative w-full max-w-lg bg-white/60 dark:bg-gray-900/60 p-3 rounded-3xl border border-white/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Yacob Tech Academy Student"
                  className="w-full h-[400px] sm:h-[460px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border border-white/40 dark:border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">AI Tutor Active</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        "Your Python script was optimized by 34%"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glass Cards Requested in Prompt */}
              {/* Card 1: Live Classes */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/80 shadow-xl flex items-center gap-2.5 animate-bounce-slow">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  Live Classes
                </span>
              </div>

              {/* Card 2: AI Tutor */}
              <div className="absolute top-1/4 -right-4 sm:-right-8 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/80 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-800 dark:text-gray-100">
                    AI Tutor
                  </span>
                  <span className="block text-[10px] text-gray-500">24/7 Assistance</span>
                </div>
              </div>

              {/* Card 3: Career Mentoring */}
              <div className="absolute bottom-1/3 -left-4 sm:-left-8 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/80 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  Career Mentoring
                </span>
              </div>

              {/* Card 4: Certificates */}
              <div className="absolute -bottom-4 right-6 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/80 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  Certificates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
