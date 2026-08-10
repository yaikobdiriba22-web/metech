import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle2, Gift } from "lucide-react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 p-8 sm:p-14 text-white shadow-2xl overflow-hidden">
          {/* Ambient shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/20 blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Gift className="w-4 h-4 text-emerald-200" />
              <span>Get 15% Off Your First Course</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Stay Updated with New Courses & AI Tools
            </h2>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Join 45,000+ developers, designers, and tech leaders receiving our weekly curated AI prompt engineering guides, tech roadmaps, and course discounts.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-sm flex items-center justify-center gap-2 animate-bounce-slow">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                Thank you! Use coupon code <span className="underline font-mono">YACOB15</span> for 15% off!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md text-gray-900 border border-white/50">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium focus:outline-none placeholder-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
            )}

            <p className="text-[10px] text-emerald-200">
              Zero spam. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
