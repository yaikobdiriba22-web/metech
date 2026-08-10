import React, { useState } from "react";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { Course } from "../types";

interface FeaturedCoursesProps {
  courses: Course[];
  selectedCategorySlug: string | null;
  onSelectCategorySlug: (slug: string | null) => void;
  wishlistIds: string[];
  onToggleWishlist: (courseId: string) => void;
  onSelectCourse: (course: Course) => void;
  enrolledCourseIds: string[];
  onEnroll: (course: Course) => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  courses,
  selectedCategorySlug,
  onSelectCategorySlug,
  wishlistIds,
  onToggleWishlist,
  onSelectCourse,
  enrolledCourseIds,
  onEnroll,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("All");

  const categoriesList = [
    { name: "All Courses", slug: null },
    { name: "AI & ML", slug: "artificial-intelligence" },
    { name: "Programming", slug: "programming" },
    { name: "UI/UX", slug: "ui-ux-design" },
    { name: "Cyber Security", slug: "cyber-security" },
    { name: "Video Editing", slug: "video-editing" },
    { name: "Cloud", slug: "cloud-computing" },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      !selectedCategorySlug || course.categoryId === selectedCategorySlug;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel =
      levelFilter === "All" || course.level === levelFilter;

    return matchesCategory && matchesSearch && matchesLevel;
  });

  return (
    <section id="courses" className="py-20 md:py-28 bg-white dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Curated Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Expert Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 max-w-xl">
              Learn in-demand technical and creative skills with hands-on projects, real-time AI tutor feedback, and industry certificates.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-gray-100 dark:border-gray-800">
          {categoriesList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategorySlug(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategorySlug === cat.slug
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No courses match your filter</h3>
            <p className="text-xs text-gray-500 mt-1">Try resetting search keywords or category selection.</p>
            <button
              onClick={() => {
                onSelectCategorySlug(null);
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isWishlisted = wishlistIds.includes(course.id);
              const isEnrolled = enrolledCourseIds.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="group bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Course Image Header */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shadow-sm">
                          {course.category}
                        </span>

                        <button
                          onClick={() => onToggleWishlist(course.id)}
                          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                            isWishlisted
                              ? "bg-red-500 text-white"
                              : "bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:text-red-500"
                          }`}
                          title="Bookmark Course"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Level Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-semibold">
                          {course.level}
                        </span>
                        {course.isPopular && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 space-y-3">
                      {/* Rating & Duration */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{course.rating}</span>
                          <span className="text-gray-400 font-normal">({course.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            {course.studentsEnrolled.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3
                        onClick={() => onSelectCourse(course)}
                        className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {course.subtitle}
                      </p>

                      {/* Instructor */}
                      <div className="pt-2 flex items-center gap-2.5 border-t border-gray-100 dark:border-gray-800">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {course.instructor.name}
                          </p>
                          <p className="text-[10px] text-gray-400">{course.instructor.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions & Price */}
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {course.price.toLocaleString()} ETB
                        </span>
                        {course.originalPrice && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {course.originalPrice.toLocaleString()} ETB
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">
                        Telebirr & CBE Birr (0906521758) | CBE Bank (1000425428016)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => onEnroll(course)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isEnrolled
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Enrolled
                          </>
                        ) : (
                          "Pay Fee"
                        )}
                      </button>
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
