import React from "react";
import {
  Compass,
  Bot,
  Code2,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Trophy,
  GraduationCap,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Course } from "../types";
import { COURSES } from "../data/initialData";

interface LearningJourneyProps {
  courses?: Course[];
  enrolledCourseIds?: string[];
  completedCourseIds?: string[];
  onSelectCourse?: (course: Course) => void;
  onToggleCompleteCourse?: (courseId: string) => void;
}

export const LearningJourney: React.FC<LearningJourneyProps> = ({
  courses = COURSES,
  enrolledCourseIds = ["course-1"],
  completedCourseIds = ["course-1"],
  onSelectCourse,
  onToggleCompleteCourse,
}) => {
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

  // Map enrolled course IDs to course objects
  const enrolledCourses = enrolledCourseIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is Course => Boolean(c));

  // Overall statistics
  const totalEnrolled = enrolledCourses.length;
  const completedCount = enrolledCourses.filter((c) =>
    completedCourseIds.includes(c.id)
  ).length;
  const overallPercentage =
    totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0;

  return (
    <section className="py-20 md:py-28 bg-gray-50/80 dark:bg-gray-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Proven Roadmap & Student Track Progress</span>
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

        {/* Enrolled Courses Visual Completion Progress Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-emerald-500/30 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Active Enrolled Tracks Progress</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                    {totalEnrolled} {totalEnrolled === 1 ? "Track" : "Tracks"}
                  </span>
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                  Track completion percentages based on finished lessons & certified module completions.
                </p>
              </div>
            </div>

            {/* Overall Summary Badge */}
            {totalEnrolled > 0 && (
              <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold">
                    Overall Journey
                  </div>
                  <div className="text-sm font-black text-emerald-800 dark:text-emerald-200">
                    {completedCount} / {totalEnrolled} Completed ({overallPercentage}%)
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-md shadow-emerald-500/30">
                  {overallPercentage}%
                </div>
              </div>
            )}
          </div>

          {/* Enrolled Courses Cards List */}
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => {
                const isCompleted = completedCourseIds.includes(course.id);
                // Calculate percentage: 100% if in completedCourseIds, else 60% in-progress baseline
                const totalLessons =
                  course.lessonsCount ||
                  (course.modules
                    ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
                    : 10);
                const effectiveLessons = totalLessons > 0 ? totalLessons : 10;
                const progressPercentage = isCompleted ? 100 : 60;
                const completedLessonsCount = isCompleted
                  ? effectiveLessons
                  : Math.round(effectiveLessons * 0.6);

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 hover:border-emerald-500/50 transition-all space-y-4 group"
                  >
                    {/* Top Row: Thumbnail + Course Info */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={
                          course.image ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={course.title}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 truncate">
                            {course.category}
                          </span>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase flex items-center gap-1 shrink-0">
                              <Trophy className="w-3 h-3 text-amber-900" />
                              100% Done
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3 text-amber-500" />
                              60% In Progress
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span>{completedLessonsCount} / {effectiveLessons} Lessons</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                          )}
                          <span>Course Completion</span>
                        </span>
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {progressPercentage}%
                        </span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden p-0.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isCompleted
                              ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-sm"
                              : "bg-gradient-to-r from-emerald-500 to-teal-400"
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 dark:border-gray-700/60 text-xs">
                      {onToggleCompleteCourse && (
                        <button
                          type="button"
                          onClick={() => onToggleCompleteCourse(course.id)}
                          className={`text-[11px] font-extrabold flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                            isCompleted
                              ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isCompleted ? "Mark Incomplete" : "Mark Complete"}</span>
                        </button>
                      )}

                      {onSelectCourse && (
                        <button
                          type="button"
                          onClick={() => onSelectCourse(course)}
                          className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 group/btn"
                        >
                          <span>Resume Learning</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Enrolled State */
            <div className="p-6 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 space-y-2">
              <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                No Active Enrolled Tracks Found
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Explore our catalog of 500+ tech tracks in AI, React, Figma, and Cloud to start your learning journey!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

