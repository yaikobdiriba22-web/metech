import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Code2,
  HelpCircle,
  FileCode,
  Brain,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Lightbulb,
  Terminal,
  Compass,
} from "lucide-react";
import { QuizQuestion, CodeReviewResult, ProjectIdea } from "../types";

interface AILearningAssistantProps {
  onOpenCareerRoadmap?: () => void;
}

export const AILearningAssistant: React.FC<AILearningAssistantProps> = ({
  onOpenCareerRoadmap,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "quiz" | "code" | "projects">("chat");

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Hello! I am your Yacob AI Tutor. How can I assist you with your coding, AI, UI design, or course study today?",
      timestamp: "Just now",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState("React 19 & TypeScript");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userQuizAnswers, setUserQuizAnswers] = useState<number[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Code Review State
  const [codeSnippet, setCodeSnippet] = useState(
    `function calculateTotal(items) {\n  let total = 0;\n  for(let i=0; i<items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`
  );
  const [codeReviewResult, setCodeReviewResult] = useState<CodeReviewResult | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);

  // Projects State
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);

  // Voice toggle state
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // 1. Chat Submit
  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: "user", text: userText, timestamp: time }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "No reply generated.", timestamp: time },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I had trouble connecting to the AI Tutor server. Please try again!",
          timestamp: time,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 2. Generate Quiz
  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizSubmitted(false);
    setUserQuizAnswers([]);
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: quizTopic }),
      });
      const data = await res.json();
      if (data.quiz) {
        setQuizQuestions(data.quiz);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  // 3. Code Review
  const handleCodeReview = async () => {
    setIsCodeLoading(true);
    try {
      const res = await fetch("/api/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeSnippet, language: "TypeScript" }),
      });
      const data = await res.json();
      if (data.review) {
        setCodeReviewResult(data.review);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCodeLoading(false);
    }
  };

  // 4. Generate Projects
  const handleGenerateProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const res = await fetch("/api/project-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: "Full Stack AI Development" }),
      });
      const data = await res.json();
      if (data.projects) {
        setProjectIdeas(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  return (
    <section
      id="ai-tutor"
      className="py-20 md:py-28 bg-gray-950 text-white relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Gen AI Tutor Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Meet Your Personal <span className="text-emerald-400">AI Tutor</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Get instant 24/7 code reviews, custom quizzes, homework answers, and portfolio project suggestions powered by Gemini 3.6 Flash.
          </p>

          {/* Feature Badges Requested in Prompt */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            {["24/7 AI Chat", "Homework Help", "Quiz Generator", "Code Review", "Project Suggestions", "Voice Assistant"].map(
              (f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-emerald-300 font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        {/* Main Glassmorphic Interactive Console */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Console Navigation */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-800 bg-gray-950/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap overflow-x-auto max-w-full pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "chat"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Bot className="w-4 h-4" />
                24/7 AI Chat
              </button>

              <button
                onClick={() => {
                  setActiveTab("quiz");
                  if (quizQuestions.length === 0) handleGenerateQuiz();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "quiz"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Brain className="w-4 h-4" />
                Quiz Generator
              </button>

              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "code"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Code2 className="w-4 h-4" />
                Code Review
              </button>

              <button
                onClick={() => {
                  setActiveTab("projects");
                  if (projectIdeas.length === 0) handleGenerateProjects();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "projects"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Project Ideas
              </button>

              {onOpenCareerRoadmap && (
                <button
                  onClick={onOpenCareerRoadmap}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  Career Roadmap
                </button>
              )}
            </div>

            {/* Voice Assistant Simulator Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all ${
                voiceEnabled
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
              }`}
            >
              {voiceEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              {voiceEnabled ? "Voice Enabled" : "Voice Off"}
            </button>
          </div>

          {/* Console Body Views */}
          <div className="p-6 md:p-8 min-h-[420px]">
            {/* VIEW 1: 24/7 AI CHAT */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-[420px] justify-between">
                {/* Chat History */}
                <div className="overflow-y-auto space-y-4 pr-2 max-h-[340px]">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-2xl ${
                        msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          msg.sender === "user"
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        {msg.sender === "user" ? "You" : <Bot className="w-4 h-4" />}
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-emerald-600 text-white rounded-tr-none"
                            : "bg-gray-950 border border-gray-800 text-gray-200 rounded-tl-none whitespace-pre-line"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="block text-[10px] text-gray-400 mt-2 text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yacob AI Tutor is thinking...
                    </div>
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap items-center gap-2 my-2">
                  {[
                    "Explain React 19 Server Components",
                    "How do I fix CORS in Express?",
                    "What is Gemini API RAG?",
                    "Suggest a Figma UI tip",
                  ].map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setChatInput(promptText);
                      }}
                      className="px-3 py-1 rounded-full bg-gray-950 hover:bg-gray-800 border border-gray-800 text-[11px] text-gray-300 transition-colors"
                    >
                      💡 {promptText}
                    </button>
                  ))}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask your AI Tutor anything about coding, courses, design, or homework..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 2: QUIZ GENERATOR */}
            {activeTab === "quiz" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="Quiz topic (e.g. Python, Cyber Security, UI Design)..."
                      className="px-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleGenerateQuiz}
                      disabled={isQuizLoading}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {isQuizLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Generate New Quiz
                    </button>
                  </div>

                  {quizSubmitted && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                      Score:{" "}
                      {
                        userQuizAnswers.filter(
                          (ans, idx) => ans === quizQuestions[idx]?.correctAnswerIndex
                        ).length
                      }{" "}
                      / {quizQuestions.length} Correct
                    </span>
                  )}
                </div>

                {isQuizLoading ? (
                  <div className="text-center py-12 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                    Generating custom quiz questions with AI...
                  </div>
                ) : quizQuestions.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-12">
                    Click "Generate New Quiz" to test your knowledge on any tech topic!
                  </p>
                ) : (
                  <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
                    {quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                        <p className="text-xs font-bold text-emerald-300">
                          Q{qIdx + 1}. {q.question}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userQuizAnswers[qIdx] === optIdx;
                            const isCorrect = q.correctAnswerIndex === optIdx;

                            let btnStyle = "bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-300";
                            if (isSelected) {
                              btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                            }
                            if (quizSubmitted) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-red-950/60 border-red-500 text-red-300";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => {
                                  const updated = [...userQuizAnswers];
                                  updated[qIdx] = optIdx;
                                  setUserQuizAnswers(updated);
                                }}
                                className={`px-3 py-2 rounded-xl text-left text-xs border transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-[11px] text-gray-400">
                            💡 <span className="font-semibold text-emerald-400">Explanation:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    {!quizSubmitted && quizQuestions.length > 0 && (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs"
                      >
                        Submit Answers
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: CODE REVIEW */}
            {activeTab === "code" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span>Paste your code snippet:</span>
                    <span className="text-[10px] text-gray-500">Supports TS, JS, Python, HTML/CSS</span>
                  </label>
                  <textarea
                    rows={10}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleCodeReview}
                    disabled={isCodeLoading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    {isCodeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> AI Reviewing Code...
                      </>
                    ) : (
                      <>
                        <Terminal className="w-4 h-4" /> Run AI Code Review
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 overflow-y-auto max-h-[380px]">
                  {codeReviewResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-gray-800">
                        <div>
                          <p className="text-xs font-bold text-gray-300">Code Health Score</p>
                          <p className="text-xl font-extrabold text-emerald-400">
                            {codeReviewResult.score} / 100
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
                          {codeReviewResult.score >= 80 ? "Pass ✅" : "Needs Refactoring ⚠️"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed">{codeReviewResult.summary}</p>

                      <div>
                        <p className="text-xs font-bold text-emerald-400 mb-1">Key Strengths:</p>
                        <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                          {codeReviewResult.keyStrengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-amber-400 mb-1">Refactored Code:</p>
                        <pre className="p-3 rounded-xl bg-gray-900 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                          {codeReviewResult.optimizedCode}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-500 text-xs">
                      Click "Run AI Code Review" to get line-by-line feedback, security check, and clean code refactoring.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 4: PROJECT IDEAS */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Handcrafted portfolio project prompts based on your study track:
                  </p>
                  <button
                    onClick={handleGenerateProjects}
                    disabled={isProjectsLoading}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    {isProjectsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Refresh Ideas
                  </button>
                </div>

                {isProjectsLoading ? (
                  <div className="text-center py-16 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-2" />
                    Generating project briefs...
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {projectIdeas.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                            {p.estimatedHours} Project
                          </span>
                          <h4 className="font-extrabold text-xs text-white mb-1">{p.title}</h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{p.description}</p>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {p.keyTechnologies.map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-gray-900 text-gray-300 text-[9px] font-mono">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-900">
                          <p className="text-[10px] text-emerald-300 font-semibold">
                            💼 Career Impact: {p.careerImpact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
