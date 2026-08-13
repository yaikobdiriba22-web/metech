import React, { useState } from "react";
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Award,
  Zap,
} from "lucide-react";
import { User, Course } from "../types";

interface DailyQuizWidgetProps {
  user: User;
  courses: Course[];
  onQuizCompleted: (earnedPoints: number) => void;
}

interface Question {
  id: number;
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DAILY_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "Full-Stack React 19",
    questionText: "Which React 19 hook simplifies asynchronous state and data fetching handling natively?",
    options: ["useActionState", "useAsyncEffect", "useFetchState", "useDataLoader"],
    correctIndex: 0,
    explanation: "useActionState is a new React 19 hook that manages pending state, returned action result values, and optimistic updates seamlessly.",
  },
  {
    id: 2,
    topic: "Python & Machine Learning",
    questionText: "What key library is primarily used for multi-dimensional array manipulation in Python machine learning workflows?",
    options: ["Flask", "NumPy", "Django", "PyGame"],
    correctIndex: 1,
    explanation: "NumPy provides high-performance N-dimensional array objects and mathematical operations fundamental for machine learning.",
  },
  {
    id: 3,
    topic: "Web Security & APIs",
    questionText: "Why should sensitive backend API keys (like Gemini or Stripe) NEVER be stored in client-side browser code?",
    options: [
      "To prevent unauthorized API usage and credential leaks via browser DevTools",
      "Because client browsers do not support string variables",
      "To speed up CSS rendering time",
      "Because backend servers run faster without environment variables",
    ],
    correctIndex: 0,
    explanation: "Exposing API keys client-side allows malicious users to inspect network requests or bundle code and steal your API quota.",
  },
  {
    id: 4,
    topic: "UI/UX & Mobile Design",
    questionText: "What is the recommended minimum touch target size for interactive mobile app controls?",
    options: ["10px", "24px", "44px", "100px"],
    correctIndex: 2,
    explanation: "A minimum touch target of 44x44px ensures comfortable, accessible tapping on touch devices.",
  },
];

export const DailyQuizWidget: React.FC<DailyQuizWidgetProps> = ({
  user,
  onQuizCompleted,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = DAILY_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < DAILY_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const earned = (score + (selectedOption === currentQ.correctIndex ? 1 : 0)) * 25 + 50; // Points calculation
      onQuizCompleted(earned);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const userPoints = user.streakPoints || 150;
  const userStreak = user.dailyStreak || 3;

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-emerald-500/30 shadow-xl space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
              Daily Tech Practice Quiz 🧠
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold text-[10px]">
                Earn Streak XP
              </span>
            </h3>
            <p className="text-gray-500 text-xs">
              Test your knowledge on web dev, AI, security, and design to keep your streak alive!
            </p>
          </div>
        </div>

        {/* Streak Stats Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{userStreak} Day Streak!</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>{userPoints} XP</span>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          {/* Question Meta */}
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
              Topic: {currentQ.topic}
            </span>
            <span className="font-extrabold text-gray-500">
              Question {currentQuestionIndex + 1} of {DAILY_QUESTIONS.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80">
            <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white leading-relaxed">
              {currentQ.questionText}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-2">
            {currentQ.options.map((option, idx) => {
              let optionStyle =
                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-emerald-500";

              if (selectedOption === idx) {
                optionStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
              }

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = "bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold";
                } else if (selectedOption === idx) {
                  optionStyle = "bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold flex items-center justify-center shrink-0 text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </span>

                  {isAnswerSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerSubmitted && (
            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-900 dark:text-teal-200 text-xs leading-relaxed space-y-1 animate-fadeIn">
              <p className="font-extrabold flex items-center gap-1 text-teal-700 dark:text-teal-300">
                <HelpCircle className="w-3.5 h-3.5" /> Explanation:
              </p>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs disabled:opacity-50 transition-colors shadow-md shadow-emerald-600/20"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
              >
                {currentQuestionIndex + 1 < DAILY_QUESTIONS.length ? "Next Question ➡️" : "Complete Quiz 🎉"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished State */
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h4 className="font-black text-lg text-gray-900 dark:text-white">
              Daily Quiz Complete! 🎉
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              You scored <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{score} / {DAILY_QUESTIONS.length}</strong> questions correct.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>+150 Streak XP Earned!</span>
          </div>

          <div>
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
