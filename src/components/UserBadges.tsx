import React from "react";
import {
  Zap,
  Trophy,
  GraduationCap,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
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
  isUnlocked: (user: User) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "course-finisher",
    name: "Course Finisher",
    description: "Successfully completed at least 1 full course",
    icon: Trophy,
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    borderColor: "border-amber-500/30",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 1,
  },
  {
    id: "fast-learner",
    name: "Fast Learner",
    description: "Mastered 2 or more courses with flying colors",
    icon: Zap,
    color: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 2,
  },
  {
    id: "master-scholar",
    name: "Master Scholar",
    description: "Completed 3 or more full tech specialization courses",
    icon: GraduationCap,
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
    borderColor: "border-purple-500/30",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 3,
  },
  {
    id: "certified-pro",
    name: "Certified Pro",
    description: "Earned an official Yacob Tech verified certificate",
    icon: Award,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    borderColor: "border-blue-500/30",
    isUnlocked: (user) => (user.completedCourseIds?.length || 0) >= 1,
  },
  {
    id: "active-enrollment",
    name: "Tech Explorer",
    description: "Actively enrolled in 2+ courses",
    icon: Flame,
    color: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
    borderColor: "border-rose-500/30",
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
  const unlockedBadges = BADGES.filter((b) => b.isUnlocked(user));
  const unlockedCount = unlockedBadges.length;

  if (variant === "compact") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Achievements & Badges
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
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
                title={`${badge.name}: ${badge.description}${isUnlocked ? " (Unlocked)" : " (Locked)"}`}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-extrabold border transition-all ${
                  isUnlocked
                    ? `${badge.bgColor} ${badge.color} ${badge.borderColor} shadow-sm`
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

  // Full detailed display
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            User Achievements & Badges
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            Earn badges by completing courses and finishing video lessons
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black font-mono">
          {unlockedCount} / {BADGES.length} Badges
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {BADGES.map((badge) => {
          const isUnlocked = badge.isUnlocked(user);
          const IconComponent = badge.icon;

          return (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                isUnlocked
                  ? `${badge.bgColor} ${badge.borderColor}`
                  : "bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-60"
              }`}
            >
              <div
                className={`p-2 rounded-lg border shrink-0 ${
                  isUnlocked
                    ? `${badge.bgColor} ${badge.color} ${badge.borderColor}`
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700"
                }`}
              >
                {isUnlocked ? (
                  <IconComponent className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4
                    className={`font-extrabold text-xs ${
                      isUnlocked
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {badge.name}
                  </h4>
                  {isUnlocked && (
                    <span className="px-1.5 py-0.2 bg-emerald-500 text-white font-black text-[9px] rounded-md uppercase">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
