import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Award,
  Clock,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  Brain,
  ShieldCheck,
  ChevronRight,
  Share2,
} from "lucide-react";
import { User } from "../types";

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onQuizCompleted: (earnedPoints: number, streakBonus: number) => void;
}

interface DailyQuestion {
  id: string;
  topic: string;
  category: "React 19" | "MERN Stack" | "AI & Python" | "Web Security" | "Algorithms";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  bonusXp: number;
}

const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    id: "dq-1",
    topic: "React 19 Server Actions & Hooks",
    category: "React 19",
    difficulty: "Intermediate",
    questionText: "In React 19, which hook is specially designed to manage pending state, form submission action responses, and optimistic UI updates natively?",
    options: [
      "useActionState",
      "useAsyncOperation",
      "useFetchHandler",
      "useFormSubmission",
    ],
    correctIndex: 0,
    explanation: "useActionState is a new React 19 hook that handles pending state transitions, action output values, and optimistic updates without requiring external Redux or custom boilerplate.",
    bonusXp: 100,
  },
  {
    id: "dq-2",
    topic: "Full-Stack Node.js & Express Security",
    category: "MERN Stack",
    difficulty: "Advanced",
    questionText: "What is the primary security vulnerability mitigated by utilizing HTTP-only, Secure SameSite cookies for storing JWT access tokens?",
    options: [
      "Cross-Site Scripting (XSS) token theft via malicious browser scripts",
      "SQL Injection attacks on PostgreSQL databases",
      "Server side request forgery (SSRF) in Cloud Run",
      "DDoS attacks on Nginx port 3000 proxies",
    ],
    correctIndex: 0,
    explanation: "HTTP-only cookies cannot be accessed or read by client-side JavaScript, rendering stored authentication tokens immune to theft via XSS vulnerabilities.",
    bonusXp: 100,
  },
  {
    id: "dq-3",
    topic: "Machine Learning & Python Fundamentals",
    category: "AI & Python",
    difficulty: "Intermediate",
    questionText: "When training deep neural networks, what technique is used to prevent model overfitting by randomly deactivating neurons during training iterations?",
    options: [
      "Dropout Regularization",
      "Gradient Ascent",
      "Data Normalization",
      "Backpropagation",
    ],
    correctIndex: 0,
    explanation: "Dropout regularization randomly sets input units to 0 with a frequency of rate at each step during training time, which helps prevent overfitting.",
    bonusXp: 100,
  },
  {
    id: "dq-4",
    topic: "Web Performance & Modern Rendering",
    category: "React 19",
    difficulty: "Beginner",
    questionText: "What is the key advantage of using Server Components in modern full-stack web applications?",
    options: [
      "Zero client-side JavaScript bundle impact for non-interactive UI code",
      "They eliminate the need for CSS stylesheets",
      "They automatically run database queries on the browser thread",
      "They disable HTML compression for faster load times",
    ],
    correctIndex: 0,
    explanation: "Server Components execute exclusively on the server, sending zero client JS bundle code for static template rendering and dramatically reducing Initial Page Load times.",
    bonusXp: 100,
  },
];

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({
  isOpen,
  onClose,
  user,
  onQuizCompleted,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const isAlreadyCompletedToday = user.lastQuizCompletedDate === todayStr;

  // Pick question based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const questionIndex = dayOfYear % DAILY_QUESTIONS.length;
  const currentQuestion = DAILY_QUESTIONS[questionIndex];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45); // 45s timer for the question
  const [timerActive, setTimerActive] = useState(true);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted || isAlreadyCompletedToday || !timerActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          // Auto submit if time runs out
          if (selectedOption !== null && !isSubmitted) {
            handleConfirm();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isSubmitted, isAlreadyCompletedToday, timerActive, selectedOption]);

  if (!isOpen) return null;

  const handleSelectOption = (index: number) => {
    if (isSubmitted || isAlreadyCompletedToday) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null || isSubmitted) return;

    const correct = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);
    setIsCorrect(correct);
    setTimerActive(false);

    const pointsEarned = correct ? currentQuestion.bonusXp : 25; // 100 XP for correct, 25 XP participation
    const streakBonus = 1;

    if (!hasClaimedReward) {
      onQuizCompleted(pointsEarned, streakBonus);
      setHasClaimedReward(true);
    }
  };

  const currentStreak = user.dailyStreak || 3;
  const currentPoints = user.streakPoints || 150;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative transition-all my-8">
        {/* Top Header Glow Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

        {/* Header Bar */}
        <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-xl text-gray-900 dark:text-white">
                  Daily Tech Challenge Quiz 🧠
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-800">
                  Daily XP Boost
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Answer today's featured question to gain +100 XP & maintain your daily streak!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Verification & Contact Card */}
        <div className="px-5 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-extrabold">
            <UserIcon className="w-4 h-4 text-emerald-500" />
            <span>{user.name || "Yaikob Diriba"}</span>
            <span className="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
              {user.plan || "Pro"} Student
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              {user.email || "yaikobdiriba22@gmail.com"}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-teal-500" />
              {user.phone || "0922067302"}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {user.address || "Addis Ababa"}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {isAlreadyCompletedToday ? (
            /* Screen when quiz is already completed for today */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 border border-emerald-500/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  Today's Challenge Completed! 🎉
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  You've already answered today's Daily Tech Question! Your daily streak is preserved and bonus XP points have been credited to your profile.
                </p>
              </div>

              {/* Stats Summary Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-amber-500/30 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Active Streak</p>
                    <p className="font-black text-sm text-gray-900 dark:text-white font-mono">
                      {currentStreak} Days 🔥
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-emerald-500/30 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Total Streak XP</p>
                    <p className="font-black text-sm text-gray-900 dark:text-white font-mono">
                      {currentPoints} XP
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Active Quiz Question Screen */
            <div className="space-y-5">
              {/* Question Metadata & Timer Bar */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold border border-purple-500/20">
                    {currentQuestion.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold">
                    Difficulty: {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold font-mono">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{timeLeft}s remaining</span>
                </div>
              </div>

              {/* Question Statement Card */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-2">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Topic: {currentQuestion.topic}
                  </span>
                  <span className="text-amber-500 font-mono font-bold">
                    +{currentQuestion.bonusXp} XP Reward
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctIndex;

                  let optionStyle =
                    "bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-emerald-500 text-gray-800 dark:text-gray-200";

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optionStyle =
                        "bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-black shadow-xs";
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle =
                        "bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200 font-bold";
                    } else {
                      optionStyle =
                        "bg-gray-100/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-400 opacity-60";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold ring-2 ring-emerald-500/30";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Result Banner */}
              {isSubmitted && (
                <div
                  className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-extrabold text-xs">
                    <span className="flex items-center gap-1.5">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Correct Answer! (+{currentQuestion.bonusXp} XP)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-500" />
                          <span>Nice Attempt! (+25 Participation XP)</span>
                        </>
                      )}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono font-black text-[10px]">
                      Streak Extended 🔥
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="font-bold">Explanation: </strong>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800">
                <div className="text-[11px] text-gray-500">
                  {isSubmitted
                    ? "XP and Streak updated on your profile!"
                    : "Select an option above to lock in your answer."}
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={handleConfirm}
                    disabled={selectedOption === null}
                    className={`px-6 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
                      selectedOption !== null
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-[1.02]"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span>Confirm Answer & Claim XP</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <span>Claim Rewards & Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
