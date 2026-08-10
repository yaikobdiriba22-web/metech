import React from "react";

export const TrustedBy: React.FC = () => {
  const companies = [
    { name: "Google", logoText: "Google", symbol: "G" },
    { name: "Microsoft", logoText: "Microsoft", symbol: "MS" },
    { name: "Adobe", logoText: "Adobe", symbol: "Ai" },
    { name: "Meta", logoText: "Meta", symbol: "∞" },
    { name: "AWS", logoText: "AWS", symbol: "aws" },
    { name: "Cisco", logoText: "Cisco", symbol: "C" },
    { name: "IBM", logoText: "IBM", symbol: "IBM" },
    { name: "Oracle", logoText: "Oracle", symbol: "O" },
  ];

  return (
    <section className="py-12 bg-gray-50/80 dark:bg-gray-900/50 border-y border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8">
          Trusted by top technology leaders & global enterprises
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white/70 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md hover:scale-105 transition-all grayscale hover:grayscale-0 group cursor-pointer"
            >
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {company.symbol}
              </span>
              <span className="font-extrabold text-sm text-gray-700 dark:text-gray-300 tracking-tight">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
