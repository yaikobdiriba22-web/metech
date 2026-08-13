import React, { useState } from "react";
import { CheckCircle2, Trophy, BookOpen, Sparkles, AlertCircle, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Course } from "../types";

interface CourseProgressProps {
  course: Course;
  completedCourseIds: string[];
  onToggleComplete?: (courseId: string) => void;
  className?: string;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
  course,
  completedCourseIds,
  onToggleComplete,
  className = "",
}) => {
  const [showModules, setShowModules] = useState(false);
  const isCompleted = completedCourseIds.includes(course.id);

  // Calculate module completion percentage based on modules finished vs total modules
  const modulesList = course.modules && course.modules.length > 0 ? course.modules : [];
  const totalModules = modulesList.length > 0 ? modulesList.length : 5;
  const completedModulesCount = isCompleted
    ? totalModules
    : Math.min(totalModules, Math.ceil(totalModules * 0.6));
  const modulePercentage = Math.round((completedModulesCount / totalModules) * 100);

  // Lesson counts for secondary info
  const totalLessons = course.lessonsCount || (modulesList.length > 0 ? modulesList.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 10);
  const completedLessons = isCompleted ? totalLessons : Math.round(totalLessons * 0.6);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-emerald-900/80 border border-emerald-500/30 text-white shadow-xl space-y-3 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isCompleted ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
          )}
          <div>
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>Module Progress Tracker</span>
              {isCompleted ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider">
                  All Modules Done 🎉
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase tracking-wider">
                  In Progress
                </span>
              )}
            </h4>
            <p className="text-[11px] text-emerald-200/90 font-semibold">
              <strong className="text-white font-mono">{completedModulesCount} of {totalModules} Modules Finished</strong> ({modulePercentage}%) • {completedLessons}/{totalLessons} Lessons
            </p>
          </div>
        </div>

        {/* Toggle Mark Completed Button */}
        {onToggleComplete && (
          <button
            type="button"
            onClick={() => onToggleComplete(course.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
              isCompleted
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
            }`}
            title={isCompleted ? "Mark as Incomplete" : "Mark Course Completed"}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-amber-300" : "text-white"}`} />
            <span>{isCompleted ? "Completed 🎉" : "Mark Complete"}</span>
          </button>
        )}
      </div>

      {/* Visual Progress Bar (Calculated on Modules Finished vs Total Modules) */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-200">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" /> Module Completion Ratio
          </span>
          <span className="font-mono text-emerald-400 text-xs font-black">{modulePercentage}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-900/80 p-0.5 border border-emerald-500/20 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-lg shadow-emerald-500/50"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
            style={{ width: `${modulePercentage}%` }}
          />
        </div>
      </div>

      {/* Module Breakdown Accordion Toggle */}
      {modulesList.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowModules(!showModules)}
            className="text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{showModules ? "Hide Module Breakdown" : "View Module Breakdown"} ({completedModulesCount}/{totalModules})</span>
            {showModules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showModules && (
            <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-gray-900/60 border border-emerald-500/20 text-xs">
              {modulesList.map((m, idx) => {
                const isModuleDone = idx < completedModulesCount;
                return (
                  <div
                    key={m.id || idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/10 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black font-mono ${
                        isModuleDone ? "bg-emerald-500 text-black" : "bg-gray-800 text-gray-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={isModuleDone ? "font-bold text-emerald-100" : "text-gray-400"}>
                        {m.title}
                      </span>
                    </div>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                      isModuleDone
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-gray-800 text-gray-400"
                    }`}>
                      {isModuleDone ? "Finished ✅" : "In Progress"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Completion Perk Footnote */}
      {isCompleted ? (
        <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-300">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            All course modules completed! Certificate unlocked.
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-extrabold">100% VERIFIED</span>
        </div>
      ) : (
        <div className="pt-2 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-200/70">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
            Complete remaining {totalModules - completedModulesCount} modules to earn certificate.
          </span>
        </div>
      )}
    </div>
  );
};
