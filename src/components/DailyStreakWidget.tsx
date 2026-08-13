import React, { useState } from "react";
import {
  Flame,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  Info,
} from "lucide-react";
import { User } from "../types";

interface DailyStreakWidgetProps {
  user: User;
  onUpdateUser?: (updatedUser: User) => void;
  className?: string;
}

export const DailyStreakWidget: React.FC<DailyStreakWidgetProps> = ({
  user,
  onUpdateUser,
  className = "",
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const currentStreak = user.dailyStreak || 3;
  const longestStreak = Math.max(user.longestStreak || 5, currentStreak);
  const streakPoints = user.streakPoints || 150;
  const isCheckedInToday = user.lastStreakCheckIn === todayStr;

  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  const handleCheckIn = () => {
    if (isCheckedInToday) return;

    const newStreak = currentStreak + 1;
    const newPoints = streakPoints + 50;
    const newLongest = Math.max(longestStreak, newStreak);

    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        dailyStreak: newStreak,
        longestStreak: newLongest,
        streakPoints: newPoints,
        lastStreakCheckIn: todayStr,
      });
    }

    setCheckInSuccess(`🔥 Awesome! ${newStreak}-Day Streak Claimed (+50 XP)!`);
    setTimeout(() => setCheckInSuccess(null), 4000);
  };

  // Weekly days representation (Mon - Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Current day index 0-6 (0 = Mon, 6 = Sun)
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  // Milestone list
  const streakMilestones = [
    { days: 3, title: "Spark Learner", points: 50, icon: Zap },
    { days: 7, title: "Week Warrior", points: 150, icon: Flame },
    { days: 14, title: "Habit Master", points: 300, icon: Award },
    { days: 30, title: "Consistency Legend", points: 1000, icon: Sparkles },
  ];

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-orange-500/10 border border-rose-500/20 shadow-lg space-y-6 ${className}`}>
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/30 animate-pulse">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                Daily Learning Streak
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-[11px] border border-rose-500/30">
                Active 🔥
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              Study or complete lessons daily to extend your streak and double your XP multipliers!
            </p>
          </div>
        </div>

        {/* Current Streak Counter Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-wider">
              Current Streak
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white font-mono flex items-center justify-end gap-1">
              <span>{currentStreak}</span>
              <span className="text-xs font-extrabold text-rose-500">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {checkInSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{checkInSuccess}</span>
        </div>
      )}

      {/* Main Check-In Action Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-extrabold text-gray-900 dark:text-white">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>Today's Daily Habit Check-In</span>
            {isCheckedInToday && (
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-md">
                Claimed Today ✅
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {isCheckedInToday
              ? "You've checked in today! Come back tomorrow to continue your streak."
              : "Claim your daily check-in to preserve your streak and earn +50 XP!"}
          </p>
        </div>

        <button
          onClick={handleCheckIn}
          disabled={isCheckedInToday}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
            isCheckedInToday
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700"
              : "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <Flame className={`w-4 h-4 ${isCheckedInToday ? "text-gray-400" : "fill-amber-200 text-amber-200"}`} />
          <span>{isCheckedInToday ? "Streak Saved Today" : "Claim Daily Streak (+50 XP)"}</span>
        </button>
      </div>

      {/* Weekly Visual Calendar Tracker (Mon - Sun) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-extrabold text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            Weekly Habit History (This Week)
          </span>
          <span className="text-[11px] text-gray-500">
            Longest Record: <strong className="text-gray-900 dark:text-white font-mono">{longestStreak} Days</strong>
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {daysOfWeek.map((dayName, idx) => {
            const isToday = idx === currentDayIndex;
            const isPast = idx < currentDayIndex;
            // Simulated completion: past days and current day if checked-in are active
            const isCompletedDay = isPast || (isToday && isCheckedInToday);

            return (
              <div
                key={dayName}
                className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                  isToday
                    ? "bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30 font-black shadow-xs"
                    : isCompletedDay
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-gray-100/80 dark:bg-gray-800/50 border-gray-200/80 dark:border-gray-800 text-gray-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tight">{dayName}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isToday
                      ? "bg-rose-500 text-white"
                      : isCompletedDay
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {isCompletedDay ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isToday ? (
                    <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  ) : (
                    <span className="text-[10px]">•</span>
                  )}
                </div>
                <span className="text-[9px] font-semibold">
                  {isToday ? "Today" : isCompletedDay ? "Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Milestones & Rewards Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-gray-900 dark:text-white">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            Streak Milestones & Multipliers
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            1x Streak Freeze Protected 🛡️
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {streakMilestones.map((m) => {
            const isReached = currentStreak >= m.days;
            const IconComponent = m.icon;

            return (
              <div
                key={m.days}
                className={`p-3 rounded-2xl border flex flex-col justify-between gap-2 transition-all ${
                  isReached
                    ? "bg-white dark:bg-gray-900 border-amber-500/50 shadow-xs"
                    : "bg-gray-50/70 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-1.5 rounded-xl ${
                      isReached
                        ? "bg-amber-500 text-black font-black"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isReached
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {isReached ? "Unlocked" : `${currentStreak}/${m.days} Days`}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white leading-tight">
                    {m.title}
                  </h4>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                    +{m.points} XP Reward
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
