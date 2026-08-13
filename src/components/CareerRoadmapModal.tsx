import React, { useState } from "react";
import {
  X,
  Compass,
  Sparkles,
  GraduationCap,
  Target,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Loader2,
  BookOpen,
  Briefcase,
  Award,
  Lightbulb,
  Zap,
  Code2,
  RefreshCw,
} from "lucide-react";
import { Course } from "../types";

export interface RoadmapStep {
  stepNumber: number;
  phaseTitle: string;
  duration: string;
  matchedCourseTitle: string;
  matchedCourseId?: string;
  keySkillsToMaster: string[];
  practicalProject: string;
  whyThisStep: string;
}

export interface CareerRoadmapData {
  roadmapTitle: string;
  careerSummary: string;
  estimatedTimeToGoal: string;
  recommendedRoleTitle: string;
  targetSalaryRange: string;
  steps: RoadmapStep[];
  careerAdvice: string[];
}

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse?: (course: Course) => void;
}

const POPULAR_GOALS = [
  "Full-Stack Web Developer",
  "AI & Machine Learning Engineer",
  "Mobile App Developer (Flutter/React Native)",
  "UI/UX & Graphic Designer",
  "Cyber Security Specialist",
  "Database & Cloud Engineer",
];

const PRESET_SKILLS = [
  "No Coding Experience",
  "HTML / CSS Basics",
  "Python Basics",
  "JavaScript Fundamentals",
  "Figma / Graphic Tools",
  "SQL / Databases",
  "Linux & Command Line",
];

export const CareerRoadmapModal: React.FC<CareerRoadmapModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse,
}) => {
  const [careerGoal, setCareerGoal] = useState("Full-Stack Web Developer");
  const [currentSkills, setCurrentSkills] = useState("Basic computer literacy and HTML/CSS");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [weeklyHours, setWeeklyHours] = useState("10-15 hours/week");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);

  if (!isOpen) return null;

  const handleGenerateRoadmap = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!careerGoal.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoal,
          currentSkills,
          experienceLevel,
          weeklyHours,
          availableCourses: courses.map((c) => ({
            id: c.id,
            title: c.title,
            category: c.category,
            level: c.level,
            duration: c.duration,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate AI roadmap. Please try again.");
      }

      const data = await res.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      } else {
        throw new Error("Invalid response format received from AI.");
      }
    } catch (err: any) {
      console.error("Roadmap generation error:", err);
      setError(err?.message || "Failed to generate AI career roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindCourse = (courseTitle: string, courseId?: string) => {
    if (!onSelectCourse) return;
    let foundCourse = courses.find((c) => c.id === courseId);
    if (!foundCourse) {
      foundCourse = courses.find((c) =>
        c.title.toLowerCase().includes(courseTitle.toLowerCase()) ||
        courseTitle.toLowerCase().includes(c.title.toLowerCase())
      );
    }
    if (foundCourse) {
      onSelectCourse(foundCourse);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-emerald-300">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-black uppercase tracking-wider mb-1 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Powered by Gemini AI
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                AI Career Roadmap Generator
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
                Get a personalized step-by-step course sequence & project milestones tailored to your tech goals.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Input Form */}
          {!roadmap && (
            <form onSubmit={handleGenerateRoadmap} className="space-y-6">
              {/* Career Goal */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  1. What is your target career goal?
                </label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Full-Stack Developer, AI Engineer, Mobile App Dev..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-gray-400 font-bold self-center">Popular Goals:</span>
                  {POPULAR_GOALS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setCareerGoal(goal)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        careerGoal === goal
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-500"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  2. Describe your current skills & background
                </label>
                <textarea
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  rows={2}
                  placeholder="e.g. I know basic HTML/CSS, basic Python syntax, and how to use GitHub..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-gray-400 font-bold self-center">Quick Select:</span>
                  {PRESET_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        setCurrentSkills((prev) =>
                          prev ? `${prev}, ${skill}` : skill
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level & Weekly Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Absolute Beginner">Absolute Beginner</option>
                    <option value="Beginner (Basic Knowledge)">Beginner (Basic Knowledge)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Self-Taught Developer">Self-Taught Developer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Weekly Commitment
                  </label>
                  <select
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="5-10 hours/week">5-10 hours/week (Part-Time)</option>
                    <option value="10-20 hours/week">10-20 hours/week (Focused)</option>
                    <option value="20+ hours/week">20+ hours/week (Intensive Bootcamp)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Your AI Career Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    Generate AI Career Roadmap
                  </>
                )}
              </button>
            </form>
          )}

          {/* Generated Roadmap View */}
          {roadmap && (
            <div className="space-y-8 animate-fadeIn">
              {/* Executive Summary Card */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 text-white border border-emerald-800/40 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-500/30 inline-block mb-2">
                      Personalized Roadmap
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-white">
                      {roadmap.roadmapTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => setRoadmap(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors self-start md:self-center"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Adjust Goal & Re-generate
                  </button>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  {roadmap.careerSummary}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black">Target Role</p>
                      <p className="text-sm font-extrabold text-white">{roadmap.recommendedRoleTitle}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-teal-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black">Estimated Timeline</p>
                      <p className="text-sm font-extrabold text-white">{roadmap.estimatedTimeToGoal}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black">Est. Salary Range</p>
                      <p className="text-xs font-extrabold text-emerald-300">{roadmap.targetSalaryRange}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps Sequence */}
              <div className="space-y-6">
                <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  Sequential Learning Phases ({roadmap.steps.length} Steps)
                </h4>

                <div className="space-y-6 relative before:absolute before:left-6 before:top-8 before:bottom-8 before:w-1 before:bg-emerald-500/20 dark:before:bg-emerald-500/10">
                  {roadmap.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative pl-14 p-6 md:p-7 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-4 hover:border-emerald-500/50 transition-all shadow-xs"
                    >
                      {/* Step Number Badge */}
                      <div className="absolute left-3 top-6 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-600/30 ring-4 ring-white dark:ring-gray-900">
                        {step.stepNumber}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700/60 pb-3">
                        <div>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Step {step.stepNumber} • {step.duration}
                          </span>
                          <h5 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                            {step.phaseTitle}
                          </h5>
                        </div>

                        {/* Matched Course Button */}
                        <button
                          onClick={() => handleFindCourse(step.matchedCourseTitle, step.matchedCourseId)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0 self-start sm:self-center"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          View Course
                        </button>
                      </div>

                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 italic">
                        "{step.whyThisStep}"
                      </p>

                      {/* Skills to master */}
                      <div>
                        <p className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400 mb-2">
                          Core Competencies to Master:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.keySkillsToMaster.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-3 py-1 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-gray-600 shadow-2xs"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Practical Milestone Project */}
                      <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
                        <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Portfolio Milestone Project:
                        </p>
                        <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mt-1">
                          {step.practicalProject}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Career Advice */}
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <h5 className="text-sm font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Expert Career Advice & Strategy
                </h5>
                <ul className="space-y-2">
                  {roadmap.careerAdvice.map((advice, aIdx) => (
                    <li
                      key={aIdx}
                      className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
