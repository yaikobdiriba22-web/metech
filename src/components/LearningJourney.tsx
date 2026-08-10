import React from "react";
import {
  Compass,
  Bot,
  Code2,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const LearningJourney: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Course",
      desc: "Select from 500+ curated tracks in AI, Full Stack, Figma Design, Cyber Security, or Cloud Engineering.",
      icon: Compass,
      color: "from-emerald-500 to-teal-500",
    },
    {
      number: "02",
      title: "Learn with AI",
      desc: "Get 24/7 step-by-step guidance, code explanations, and interactive quizzes from your dedicated AI Tutor.",
      icon: Bot,
      color: "from-teal-500 to-emerald-600",
    },
    {
      number: "03",
      title: "Complete Projects",
      desc: "Apply your knowledge by building real-world SaaS apps, design systems, and cloud architectures.",
      icon: Code2,
      color: "from-emerald-600 to-green-600",
    },
    {
      number: "04",
      title: "Earn Certificate",
      desc: "Receive a verified digital certificate with a QR code link to showcase on your LinkedIn and resume.",
      icon: Award,
      color: "from-green-600 to-emerald-400",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50/80 dark:bg-gray-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Proven Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your 4-Step Learning Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            How Yacob Tech Academy guides you from beginner to job-ready professional.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-gray-200 dark:text-gray-800 group-hover:text-emerald-500 transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Arrow Connector for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-gray-800 border border-emerald-200 dark:border-gray-700 text-emerald-600 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
