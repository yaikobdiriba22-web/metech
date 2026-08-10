import React from "react";
import { Star, Sparkles, Quote } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-20 md:py-28 bg-gray-50/70 dark:bg-gray-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Trusted by 15,000+ Students Worldwide
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            See how our AI-powered courses, career mentorship, and practical hands-on projects transformed our students' careers.
          </p>
        </div>

        {/* Testimonials Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg hover:shadow-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-emerald-500/20 absolute top-6 right-6 group-hover:text-emerald-500/40 transition-colors" />

              <div className="space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Quote */}
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{t.review}"
                </p>

                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Course: {t.courseTaken}
                </div>
              </div>

              {/* Student Profile */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 mt-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    {t.name} <span className="text-xs">{t.countryFlag}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t.role} @ {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
