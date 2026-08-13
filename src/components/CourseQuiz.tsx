import React, { useState, useEffect } from "react";
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Trophy,
  BrainCircuit,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { Course, QuizQuestion, QuizResult, User } from "../types";
import { useToast } from "../context/ToastContext";

interface CourseQuizProps {
  course: Course;
  lessonTitle: string;
  lessonId?: string;
  user: User | null;
  onSaveResult: (result: QuizResult) => void;
  onClose: () => void;
}

export const CourseQuiz: React.FC<CourseQuizProps> = ({
  course,
  lessonTitle,
  lessonId,
  user,
  onSaveResult,
  onClose,
}) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Generate / Load Quiz questions for this specific course & lesson
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    fetch("/api/ai-lesson-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseTitle: course.title,
        lessonTitle,
        level: course.level,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
            setSelectedAnswers(new Array(data.questions.length).fill(-1));
          } else {
            // Fallback default questions
            useFallbackQuestions();
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load AI quiz, using fallback questions:", err);
        if (isMounted) {
          useFallbackQuestions();
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [course.title, lessonTitle]);

  const useFallbackQuestions = () => {
    const fallback: QuizQuestion[] = [
      {
        question: `What is a fundamental concept covered in "${lessonTitle}" for ${course.title}?`,
        options: [
          "Understanding standard structure and design patterns",
          "Random variable declaration without types",
          "Direct database mutations on the frontend",
          "Bypassing asynchronous handling completely",
        ],
        correctAnswerIndex: 0,
        explanation:
          "Structuring your application according to established design patterns improves maintainability, readability, and scalability.",
      },
      {
        question: `Why is testing core logic essential when completing lessons in ${course.title}?`,
        options: [
          "To slow down the development workflow",
          "To catch bugs early and guarantee expected system behavior",
          "It is required by browser vendors",
          "To duplicate source code unnecessarily",
        ],
        correctAnswerIndex: 1,
        explanation:
          "Automated and manual testing verifies that components and logic function as intended before deploying to production.",
      },
      {
        question: `Which best practice should be applied when developing software solutions in ${course.category}?`,
        options: [
          "Hardcoding secret credentials in client components",
          "Writing clear, modular, and well-documented code",
          "Ignoring runtime exceptions",
          "Using non-standard custom syntax without transpilation",
        ],
        correctAnswerIndex: 1,
        explanation:
          "Modular architecture paired with standard clean code principles ensures team collaboration and production stability.",
      },
      {
        question: "How should state management and data mutations be handled in modern web applications?",
        options: [
          "By updating global DOM directly using raw strings",
          "By using predictable state handlers and reactive data flows",
          "By relying strictly on browser cookies for UI state",
          "By re-instantiating full application frames on every keypress",
        ],
        correctAnswerIndex: 1,
        explanation:
          "Predictable state management prevents race conditions, infinite re-renders, and state desynchronization.",
      },
    ];
    setQuestions(fallback);
    setSelectedAnswers(new Array(fallback.length).fill(-1));
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setIsSubmitted(true);

    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    const result: QuizResult = {
      id: `quiz-res-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      lessonId: lessonId || `lesson-${Date.now()}`,
      lessonTitle,
      score,
      totalQuestions: questions.length,
      percentage,
      passed,
      completedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    onSaveResult(result);
    setSavedStatus(true);

    if (passed) {
      toast.achievement(
        "Quiz Milestone Passed! 🏆",
        `You scored ${score}/${questions.length} (${percentage}%) on "${lessonTitle}"! Saved to profile.`
      );
    } else {
      toast.info(
        "Quiz Completed 📝",
        `You scored ${score}/${questions.length} (${percentage}%) on "${lessonTitle}". Review answers below to improve.`
      );
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setQuizScore(0);
    setSavedStatus(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = selectedAnswers.filter((ans) => ans !== -1).length;
  const isAllAnswered = answeredCount === questions.length;
  const percentage = questions.length > 0 ? Math.round((quizScore / questions.length) * 100) : 0;
  const passed = percentage >= 60;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative flex flex-col max-h-[92vh] my-auto text-xs">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 text-white flex items-center justify-between border-b border-emerald-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              <BrainCircuit className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[9px] font-extrabold uppercase">
                  Lesson Quiz 📝
                </span>
                <span className="text-[10px] text-gray-300 truncate max-w-[200px]">
                  {course.title}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                {lessonTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <div className="space-y-1">
                <p className="font-extrabold text-sm text-gray-900 dark:text-white">
                  Generating AI Lesson Quiz...
                </p>
                <p className="text-gray-500 text-xs">
                  Gemini AI is crafting tailored questions based on "{lessonTitle}"
                </p>
              </div>
            </div>
          ) : isSubmitted ? (
            /* Results Screen */
            <div className="space-y-6 text-center py-2">
              <div
                className={`p-6 rounded-3xl border ${
                  passed
                    ? "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/40"
                    : "bg-rose-500/10 border-rose-500/30 dark:bg-rose-950/40"
                }`}
              >
                <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-3 bg-white dark:bg-gray-800">
                  {passed ? (
                    <Trophy className="w-9 h-9 text-amber-400" />
                  ) : (
                    <AlertCircle className="w-9 h-9 text-rose-500" />
                  )}
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {passed ? "Congratulations! Lesson Passed 🎉" : "Keep Practicing! Try Again"}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                  You scored <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{quizScore}</strong> out of{" "}
                  <strong>{questions.length}</strong> ({percentage}%)
                </p>

                {savedStatus && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Saved to your student profile & dashboard!</span>
                  </div>
                )}
              </div>

              {/* Review Breakdown */}
              <div className="text-left space-y-3">
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Question & Answer Review
                </h4>

                <div className="space-y-3">
                  {questions.map((q, qIdx) => {
                    const studentAns = selectedAnswers[qIdx];
                    const isCorrect = studentAns === q.correctAnswerIndex;

                    return (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-2xl border ${
                          isCorrect
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                            : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-bold text-gray-900 dark:text-white text-xs">
                            {qIdx + 1}. {q.question}
                          </p>
                          {isCorrect ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-extrabold text-[10px] shrink-0">
                              Correct +1
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold text-[10px] shrink-0">
                              Incorrect
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
                          <p>
                            Your answer:{" "}
                            <strong className={isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                              {studentAns >= 0 ? q.options[studentAns] : "Not answered"}
                            </strong>
                          </p>
                          {!isCorrect && (
                            <p>
                              Correct answer:{" "}
                              <strong className="text-emerald-600 dark:text-emerald-400">
                                {q.options[q.correctAnswerIndex]}
                              </strong>
                            </p>
                          )}
                          <p className="mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-400 italic">
                            💡 <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Restart / Close Action */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Close & Continue Learning
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Screen */
            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold">
                  <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>{answeredCount}/{questions.length} Answered</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestionIndex + 1}. {currentQuestion?.question}
                </h4>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQuestion?.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border font-medium text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40 shadow-sm"
                          : "bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>

                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Hint if selected */}
              {selectedAnswers[currentQuestionIndex] !== -1 && (
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>Option selected! Click "Submit Quiz" when ready to reveal complete answers and AI breakdown.</p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-black dark:hover:bg-gray-100 flex items-center gap-1.5 transition-all"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!isAllAnswered}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Submit & Grade Quiz</span>
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
