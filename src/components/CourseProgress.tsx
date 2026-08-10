import React from "react";
import { CheckCircle2, Trophy, BookOpen, Sparkles, AlertCircle } from "lucide-react";
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
  const isCompleted = completedCourseIds.includes(course.id);
  
  // Calculate completion percentage and completed lesson count
  const totalLessons = course.lessonsCount || (course.modules ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 10);
  const effectiveTotalLessons = totalLessons > 0 ? totalLessons : 10;
  
  // If course ID is in completedCourseIds, 100% completed. Otherwise 60% in-progress demo baseline if enrolled
  const percentage = isCompleted ? 100 : Math.round((effectiveTotalLessons * 0.6 / effectiveTotalLessons) * 100);
  const completedLessons = isCompleted ? effectiveTotalLessons : Math.round(effectiveTotalLessons * 0.6);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-emerald-900/80 border border-emerald-500/30 text-white shadow-xl ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-300" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
          )}
          <div>
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>Course Learning Progress</span>
              {isCompleted ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider">
                  Completed
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase tracking-wider">
                  In Progress
                </span>
              )}
            </h4>
            <p className="text-[11px] text-emerald-200/80">
              {completedLessons} of {effectiveTotalLessons} video lessons finished ({percentage}%)
            </p>
          </div>
        </div>

        {/* Toggle Mark Completed Button */}
        {onToggleComplete && (
          <button
            type="button"
            onClick={() => onToggleComplete(course.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
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

      {/* Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-200">
          <span>Overall Course Mastery</span>
          <span className="font-mono text-emerald-400 text-xs font-black">{percentage}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-900/80 p-0.5 border border-emerald-500/20 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-lg shadow-emerald-500/50"
                : "bg-gradient-to-r from-emerald-500 to-teal-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Completion Perk Footnote */}
      {isCompleted ? (
        <div className="mt-3 pt-2.5 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-300">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Official Certificate of Completion is unlocked!
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-extrabold">100% VERIFIED</span>
        </div>
      ) : (
        <div className="mt-3 pt-2.5 border-t border-emerald-800/50 flex items-center justify-between text-[11px] text-emerald-200/70">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
            Finish remaining lessons to generate your verified certificate.
          </span>
        </div>
      )}
    </div>
  );
};
