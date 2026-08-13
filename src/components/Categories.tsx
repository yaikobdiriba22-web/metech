import React, { useState, useMemo } from "react";
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
  Search,
  X,
  Tag,
  Star,
  User,
  Clock,
  BookOpen,
  SearchX,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, Course } from "../types";
import { COURSES } from "../data/initialData";

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  courses = COURSES,
  onSelectCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const popularTags = [
    "React 19",
    "Python",
    "Full-Stack",
    "Gemini AI",
    "Ethical Hacking",
    "Figma",
    "Tailwind",
    "Docker",
    "Video Editing",
    "Data Science",
  ];

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

  // Real-time filtering logic for courses and categories
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return courses.filter((course) => {
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCategory = course.category.toLowerCase().includes(q);
      const matchDescription = course.description.toLowerCase().includes(q);
      const matchTags = course.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchInstructor = course.instructor.name.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchDescription || matchTags || matchInstructor;
    });
  }, [searchQuery, courses]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchDesc = cat.description.toLowerCase().includes(q);
      const matchSlug = cat.slug.toLowerCase().includes(q);
      return matchName || matchDesc || matchSlug;
    });
  }, [searchQuery, categories]);

  const handleTagClick = (tag: string) => {
    if (searchQuery.toLowerCase() === tag.toLowerCase()) {
      setSearchQuery("");
    } else {
      setSearchQuery(tag);
    }
  };

  return (
    <section id="categories" className="py-20 md:py-28 bg-gray-50/70 dark:bg-gray-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Explore Skill Tracks & Live Search</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Top Categories & Real-Time Skill Filter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Discover 500+ specialized courses organized into industry-aligned categories. Type any course name or skill tag below to filter in real-time.
          </p>
        </div>

        {/* Real-Time Search Bar & Popular Tag Chips */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or skill tags (e.g. React 19, Python, Figma, Gemini AI)..."
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm sm:text-base shadow-lg shadow-gray-200/40 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              {searchQuery.trim() !== "" && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-black">
                  {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
                </span>
              )}
            </div>
          </div>

          {/* Popular Skill Tag Chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
            <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-500" />
              Quick Skill Filter:
            </span>
            {popularTags.map((tag) => {
              const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/70 text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-102"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>#{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-Time Filtered Results view */}
        {searchQuery.trim() !== "" ? (
          <div className="space-y-12 animate-fadeIn">
            {/* Filtered Courses Section */}
            {filteredCourses.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 pb-4">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    Matching Courses for "{searchQuery}"
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Showing {filteredCourses.length} results
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
                    >
                      {/* Image Thumbnail Header */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-extrabold backdrop-blur-md">
                          {course.category}
                        </span>
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                          {course.level}
                        </span>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-300">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            {course.rating} ({course.reviewsCount})
                          </span>
                          <span className="flex items-center gap-1 text-gray-200 text-[11px]">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {course.duration}
                          </span>
                        </div>
                      </div>

                      {/* Course Card Content */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* Matching Skill Tags */}
                        <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500">
                            Skill Tags:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {course.tags.map((tag) => {
                              const isMatch = tag.toLowerCase().includes(searchQuery.toLowerCase());
                              return (
                                <span
                                  key={tag}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    isMatch
                                      ? "bg-emerald-500 text-white shadow-xs"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  #{tag}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Card Footer: Instructor + Price & Action */}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={course.instructor.avatar}
                              alt={course.instructor.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                              {course.instructor.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                              {course.price === 0 ? "FREE" : `$${course.price}`}
                            </span>
                            <button
                              onClick={() => onSelectCourse && onSelectCourse(course)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-transform active:scale-95 shadow-sm shadow-emerald-600/20"
                            >
                              Enroll Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Categories Section */}
            {filteredCategories.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Matching Skill Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredCategories.map((cat) => {
                    const IconComponent = getIcon(cat.iconName);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                        }}
                        className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-emerald-500 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {cat.coursesCount} Courses
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State when Search Query Has No Matches */}
            {filteredCourses.length === 0 && filteredCategories.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <SearchX className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
                    No matching courses found for "{searchQuery}"
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Try searching for different keywords, skill tags like <strong>React</strong>, <strong>Python</strong>, or <strong>Figma</strong>, or clear the search input.
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Default Categories Bento Grid (When no search active) */
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
        )}
      </div>
    </section>
  );
};

