import React, { useState } from "react";
import { Check, X, Sparkles, Zap, ArrowRight } from "lucide-react";
import { PricingPlan } from "../types";

interface PricingProps {
  plans: PricingPlan[];
  onSelectPlan: (plan: PricingPlan) => void;
}

export const Pricing: React.FC<PricingProps> = ({ plans, onSelectPlan }) => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Flexible Plans for Every Learner
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Start free or unlock unlimited courses, 24/7 AI Tutor access, and verified certificates.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-semibold ${
                !isYearly ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500"
              }`}
            >
              Monthly Billing
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-8 rounded-full bg-emerald-600 p-1 relative transition-colors focus:outline-none"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-semibold flex items-center gap-1.5 ${
                isYearly ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-gray-500"
              }`}
            >
              Yearly Billing
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-emerald-950/80 to-gray-900 text-white border-emerald-500 shadow-2xl shadow-emerald-500/20 md:-translate-y-2"
                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-[11px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold">{plan.name}</h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        plan.popular ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black">
                      {price === 0 ? "Free" : `${price.toLocaleString()} ETB`}
                    </span>
                    {price > 0 && (
                      <span
                        className={`text-xs font-semibold ${
                          plan.popular ? "text-emerald-300" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        / month {isYearly ? "(billed annually)" : ""}
                      </span>
                    )}
                  </div>
                  {price > 0 && (
                    <p className={`text-[10px] font-bold flex items-center gap-1 ${
                      plan.popular ? "text-amber-300" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      <span>🇪🇹 Telebirr/CBE Birr (0906521758) & CBE Bank (1000425428016)</span>
                    </p>
                  )}

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Included Features:
                    </p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <div
                            className={`p-1 rounded-full shrink-0 ${
                              plan.popular
                                ? "bg-emerald-500 text-white"
                                : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-full shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-400">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                        <span
                          className={
                            feat.included
                              ? plan.popular
                                ? "text-gray-200"
                                : "text-gray-700 dark:text-gray-300 font-medium"
                              : "text-gray-400 line-through"
                          }
                        >
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full mt-8 py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white"
                  }`}
                >
                  {plan.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
