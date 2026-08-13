import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  Coffee,
  Sparkles,
  Flame,
  BookOpen,
  Plus,
  Minus,
  Volume2,
} from "lucide-react";
import { Course } from "../types";

interface StudyTimerWidgetProps {
  enrolledCourses: Course[];
  onSessionComplete?: (minutesLogged: number, courseTitle: string) => void;
}

export const StudyTimerWidget: React.FC<StudyTimerWidgetProps> = ({
  enrolledCourses,
  onSessionComplete,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    enrolledCourses[0]?.id || "general"
  );
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [initialSeconds, setInitialSeconds] = useState<number>(25 * 60); // 25 mins
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch modes
  const handleModeChange = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);

    let secs = 25 * 60;
    if (newMode === "shortBreak") secs = 5 * 60;
    if (newMode === "longBreak") secs = 15 * 60;

    setInitialSeconds(secs);
    setSecondsLeft(secs);
  };

  // Adjust time by +/- 5 mins
  const adjustTime = (deltaMinutes: number) => {
    if (isActive) return;
    const newSecs = Math.max(60, secondsLeft + deltaMinutes * 60);
    setInitialSeconds(newSecs);
    setSecondsLeft(newSecs);
  };

  // Timer tick effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsActive(false);

            // Handle completion
            const mins = Math.round(initialSeconds / 60);
            if (mode === "focus") {
              setCompletedSessions((c) => c + 1);
              setTotalFocusMinutes((t) => t + mins);
              const courseObj = enrolledCourses.find((c) => c.id === selectedCourseId);
              const courseTitle = courseObj ? courseObj.title : "General Tech Study";

              if (onSessionComplete) {
                onSessionComplete(mins, courseTitle);
              }

              setShowNotification(`🎉 Focus Session Complete! +${mins} mins logged for "${courseTitle}". Take a break!`);
            } else {
              setShowNotification("🔔 Break finished! Ready for another focused study sprint?");
            }

            setTimeout(() => setShowNotification(null), 6000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, initialSeconds, selectedCourseId, enrolledCourses, onSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(initialSeconds);
  };

  // Formatting MM:SS
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = Math.min(100, Math.max(0, ((initialSeconds - secondsLeft) / initialSeconds) * 100));

  const selectedCourse = enrolledCourses.find((c) => c.id === selectedCourseId);

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-emerald-500/30 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              Pomodoro Study Timer ⏱️
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                Active Track
              </span>
            </h3>
            <p className="text-gray-500 text-xs">
              Boost focus & track study hours per course session using Pomodoro cycles.
            </p>
          </div>
        </div>

        {/* Total stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            <span>{completedSessions} Sessions</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{totalFocusMinutes} Mins Focused</span>
          </div>
        </div>
      </div>

      {/* Completion Toast Notification */}
      {showNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Mode Selectors */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl">
        <button
          onClick={() => handleModeChange("focus")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            mode === "focus"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Focus Sprint (25m)
        </button>
        <button
          onClick={() => handleModeChange("shortBreak")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            mode === "shortBreak"
              ? "bg-amber-500 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Short Break (5m)
        </button>
        <button
          onClick={() => handleModeChange("longBreak")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            mode === "longBreak"
              ? "bg-teal-600 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          Long Break (15m)
        </button>
      </div>

      {/* Course Selection Dropdown */}
      {enrolledCourses.length > 0 && (
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
            Select Course to Track Study Session For:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={isActive}
            className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          >
            <option value="general">🎓 General Tech Study & Practice</option>
            {enrolledCourses.map((c) => (
              <option key={c.id} value={c.id}>
                📖 {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Clock Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/80 dark:to-gray-900 border border-gray-200/80 dark:border-gray-700/80 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
        {/* Progress Bar Background */}
        <div
          className="absolute bottom-0 left-0 top-0 bg-emerald-500/10 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Selected Course Tag */}
        <span className="relative z-10 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-extrabold max-w-[90%] truncate">
          {selectedCourse ? `Target: ${selectedCourse.title}` : "General Study Focus"}
        </span>

        {/* Display Timer */}
        <div className="relative z-10 text-5xl sm:text-6xl font-black font-mono tracking-wider text-gray-900 dark:text-white drop-shadow-sm">
          {formattedTime}
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => adjustTime(-5)}
            disabled={isActive || secondsLeft <= 300}
            className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-colors"
            title="Subtract 5 Mins"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isActive
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start Focus Session
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => adjustTime(5)}
            disabled={isActive}
            className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-40 transition-colors"
            title="Add 5 Mins"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
