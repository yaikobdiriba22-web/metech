import React, { useState } from "react";
import {
  Zap,
  Trophy,
  GraduationCap,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Crown,
  BookOpen,
  Filter,
  ArrowRight,
} from "lucide-react";
import { User } from "../types";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  requiredCount: number;
  category: "completed" | "enrolled" | "certificate";
  tierName: string;
  isUnlocked: (user: User) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "course-finisher",
    name: "Course Finisher",
    description: "Successfully completed at least 1 full course track",
    icon: Trophy,
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    borderColor: "border-amber-500/30",
    requiredCount: 1,
    category: "completed",
    tierName: "Milestone Tier 1",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 1,
  },
  {
    id: "fast-learner",
    name: "Fast Learner",
    description: "Mastered 2 or more course tracks with flying speed",
    icon: Zap,
    color: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    requiredCount: 2,
    category: "completed",
    tierName: "Milestone Tier 2",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 2,
  },
  {
    id: "fullstack-hero",
    name: "Full-Stack Hero",
    description: "Completed 3 full-stack engineering & tech specialized tracks",
    icon: ShieldCheck,
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-500/10 dark:bg-teal-500/20",
    borderColor: "border-teal-500/30",
    requiredCount: 3,
    category: "completed",
    tierName: "Milestone Tier 3",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 3,
  },
  {
    id: "master-scholar",
    name: "Master Scholar",
    description: "Completed 4 or more full tech specialization courses",
    icon: GraduationCap,
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
    borderColor: "border-purple-500/30",
    requiredCount: 4,
    category: "completed",
    tierName: "Milestone Tier 4",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 4,
  },
  {
    id: "academy-legend",
    name: "Academy Legend",
    description: "Elite status! Completed 5 or more academy learning tracks",
    icon: Crown,
    color: "text-amber-400 dark:text-amber-300",
    bgColor: "bg-amber-400/10 dark:bg-amber-400/20",
    borderColor: "border-amber-400/30",
    requiredCount: 5,
    category: "completed",
    tierName: "Milestone Tier 5",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 5,
  },
  {
    id: "certified-pro",
    name: "Certified Pro",
    description: "Earned an official Yacob Tech verified certificate",
    icon: Award,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    borderColor: "border-blue-500/30",
    requiredCount: 1,
    category: "certificate",
    tierName: "Special Achievement",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 1,
  },
  {
    id: "active-enrollment",
    name: "Tech Explorer",
    description: "Actively enrolled in 2+ courses simultaneously",
    icon: Flame,
    color: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    borderColor: "border-rose-500/30",
    requiredCount: 2,
    category: "enrolled",
    tierName: "Explorer Badge",
    isUnlocked: (user) => (user.enrolledCourseIds?.length || 0) >= 2,
  },
];

interface UserBadgesProps {
  user: User;
  variant?: "compact" | "full";
  className?: string;
}

export const UserBadges: React.FC<UserBadgesProps> = ({
  user,
  variant = "compact",
  className = "",
}) => {
  const [filter, setFilter] = useState<"all" | "milestones" | "unlocked" | "locked">("all");

  const completedCount = user.completedCourseIds?.length || 0;
  const unlockedBadges = BADGES.filter((b) => b.isUnlocked(user));
  const unlockedCount = unlockedBadges.length;

  // Milestone levels sequence based on completedCourseIds count
  const milestoneList = [
    { name: "Course Finisher", count: 1, icon: Trophy, id: "course-finisher" },
    { name: "Fast Learner", count: 2, icon: Zap, id: "fast-learner" },
    { name: "Full-Stack Hero", count: 3, icon: ShieldCheck, id: "fullstack-hero" },
    { name: "Master Scholar", count: 4, icon: GraduationCap, id: "master-scholar" },
    { name: "Academy Legend", count: 5, icon: Crown, id: "academy-legend" },
  ];

  // Next upcoming milestone
  const nextMilestone = milestoneList.find((m) => completedCount < m.count);

  if (variant === "compact") {
    return (
      <div className={`space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Milestone Badges ({completedCount} Courses Done)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-black">
            {unlockedCount}/{BADGES.length} Unlocked
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {BADGES.map((badge) => {
            const isUnlocked = badge.isUnlocked(user);
            const IconComponent = badge.icon;

            return (
              <div
                key={badge.id}
                title={`${badge.name}: ${badge.description}${
                  isUnlocked ? " (Unlocked 🎉)" : ` (${completedCount}/${badge.requiredCount} completed)`
                }`}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold border transition-all ${
                  isUnlocked
                    ? `${badge.bgColor} ${badge.color} ${badge.borderColor} shadow-xs`
                    : "bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 opacity-60"
                }`}
              >
                {isUnlocked ? (
                  <IconComponent className="w-3 h-3 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 shrink-0 text-gray-400" />
                )}
                <span>{badge.name}</span>
                {isUnlocked && <CheckCircle2 className="w-2.5 h-2.5 ml-0.5 text-emerald-500" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full detailed badges view with milestone timeline & filter controls
  const filteredBadges = BADGES.filter((b) => {
    if (filter === "unlocked") return b.isUnlocked(user);
    if (filter === "locked") return !b.isUnlocked(user);
    if (filter === "milestones") return b.category === "completed";
    return true;
  });

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Student Milestone Badges & Medals</span>
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Earn exclusive milestone badges as you complete courses in your Yacob Tech Academy journey.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{unlockedCount} / {BADGES.length} Badges Earned</span>
          </div>
        </div>
      </div>

      {/* Visual Milestone Progress Tracker Timeline */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-amber-500/5 border border-emerald-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Milestone Career Progression ({completedCount} Completed Courses)
          </h4>
          {nextMilestone && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Next: {nextMilestone.name} ({completedCount}/{nextMilestone.count})</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {milestoneList.map((ms) => {
            const isReached = completedCount >= ms.count;
            const IconComp = ms.icon;
            return (
              <div
                key={ms.id}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center space-y-1 transition-all ${
                  isReached
                    ? "bg-white dark:bg-gray-800 border-emerald-500 shadow-xs text-emerald-900 dark:text-emerald-200"
                    : "bg-gray-100/70 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-400"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isReached
                      ? "bg-emerald-500 text-black font-black"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-[11px] leading-tight line-clamp-1">{ms.name}</p>
                  <p className="text-[9px] font-bold text-gray-500">
                    {ms.count} {ms.count === 1 ? "Course" : "Courses"}
                  </p>
                </div>
                {isReached ? (
                  <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[8px] font-black rounded uppercase">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-400 font-semibold">
                    {completedCount}/{ms.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {(
          [
            { id: "all", label: `All (${BADGES.length})` },
            { id: "milestones", label: "Milestones Only" },
            { id: "unlocked", label: `Unlocked (${unlockedCount})` },
            { id: "locked", label: `Locked (${BADGES.length - unlockedCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              filter === tab.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredBadges.map((badge) => {
          const isUnlocked = badge.isUnlocked(user);
          const IconComponent = badge.icon;

          // Calculate current progress count & percentage
          let currentProgressCount = 0;
          if (badge.category === "completed") {
            currentProgressCount = completedCount;
          } else if (badge.category === "enrolled") {
            currentProgressCount = user.enrolledCourseIds?.length || 0;
          } else {
            currentProgressCount = completedCount >= 1 ? 1 : 0;
          }

          const progressPercent = isUnlocked
            ? 100
            : Math.min(100, Math.round((currentProgressCount / badge.requiredCount) * 100));

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                isUnlocked
                  ? `${badge.bgColor} ${badge.borderColor} shadow-xs`
                  : "bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800/80 opacity-75"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-2xl border shrink-0 ${
                    isUnlocked
                      ? `${badge.bgColor} ${badge.color} ${badge.borderColor} shadow-xs`
                      : "bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {isUnlocked ? (
                    <IconComponent className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {badge.tierName}
                    </span>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 bg-emerald-500 text-black font-black text-[9px] rounded-md uppercase flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-black" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-[9px] rounded-md uppercase shrink-0">
                        Locked
                      </span>
                    )}
                  </div>

                  <h4
                    className={`font-black text-sm ${
                      isUnlocked ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {badge.name}
                  </h4>

                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar towards Badge Unlock */}
              <div className="space-y-1 pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex justify-between items-center text-[10px] font-extrabold">
                  <span className="text-gray-500">
                    {isUnlocked
                      ? "Milestone Requirement Satisfied"
                      : `Progress: ${currentProgressCount} / ${badge.requiredCount} ${
                          badge.category === "enrolled" ? "Enrolled" : "Completed"
                        }`}
                  </span>
                  <span className={isUnlocked ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"}>
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isUnlocked
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

