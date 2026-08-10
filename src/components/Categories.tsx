import React from "react";
import {
  Code2,
  Palette,
  Sparkles,
  ShieldCheck,
  Video,
  Layout,
  TrendingUp,
  Cloud,
  Briefcase,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { Category } from "../types";

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return Code2;
      case "Palette":
        return Palette;
      case "Sparkles":
        return Sparkles;
      case "ShieldCheck":
        return ShieldCheck;
      case "Video":
        return Video;
      case "Layout":
        return Layout;
      case "TrendingUp":
        return TrendingUp;
      case "Cloud":
        return Cloud;
      case "Briefcase":
        return Briefcase;
      case "Database":
        return Database;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="categories" className="py-20 md:py-28 bg-gray-50/70 dark:bg-gray-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Explore Skill Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Top Learning Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Discover 500+ specialized courses organized into industry-aligned categories designed for rapid skill mastery.
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const IconComponent = getIcon(cat.iconName);
            const isSelected = selectedCategory === cat.slug;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-600/30 scale-[1.02]"
                    : "bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                }`}
              >
                {/* Background Subtle Gradient */}
                {!isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                )}

                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  {/* Top Bar: Icon + Arrow */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-gray-700"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <ArrowUpRight
                      className={`w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isSelected ? "text-white" : "text-gray-400 group-hover:text-emerald-500"
                      }`}
                    />
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3
                      className={`font-extrabold text-base tracking-tight mb-1 ${
                        isSelected ? "text-white" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        isSelected ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {cat.description}
                    </p>
                  </div>

                  {/* Courses Count Badge */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        isSelected ? "text-emerald-100" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {cat.coursesCount} Courses
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      Explore
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
