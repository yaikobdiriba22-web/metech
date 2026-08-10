import React, { useState } from "react";
import {
  X,
  Star,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  Award,
  PlayCircle,
  FileText,
  Lock,
  MessageSquare,
  Upload,
  ShieldCheck,
  Building2,
  Smartphone,
} from "lucide-react";
import { Course } from "../types";
import { AskMentorModal } from "./AskMentorModal";
import { CourseProgress } from "./CourseProgress";

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  enrollmentStatus: "not_enrolled" | "pending_approval" | "approved";
  onEnrollClick: (course: Course) => void;
  onViewCertificate: () => void;
  completedCourseIds?: string[];
  onToggleCompleteCourse?: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  enrollmentStatus,
  onEnrollClick,
  onViewCertificate,
  completedCourseIds = [],
  onToggleCompleteCourse,
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor">("overview");
  const [playingVideo, setPlayingVideo] = useState(false);
  const [showAskMentorModal, setShowAskMentorModal] = useState(false);

  const etbPrice = course.price;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative max-h-[90vh] flex flex-col my-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video / Banner Header */}
          <div className="relative h-56 sm:h-64 bg-gray-950 overflow-hidden shrink-0">
            {playingVideo ? (
              <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                  <PlayCircle className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold">Playing Demo Lesson: Introduction to {course.title}</p>
                <button
                  onClick={() => setPlayingVideo(false)}
                  className="px-4 py-1.5 rounded-full bg-gray-800 text-xs font-semibold hover:bg-gray-700"
                >
                  Close Video Player
                </button>
              </div>
            ) : (
              <>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/90 text-[10px] font-bold">
                      {course.category}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      🇪🇹 {course.price.toLocaleString()} ETB
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold line-clamp-2">{course.title}</h2>
                  <div className="flex items-center gap-4 text-xs text-gray-300 mt-2">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-current" /> {course.rating} ({course.reviewsCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-400" /> {course.studentsEnrolled} enrolled
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setPlayingVideo(true)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-full bg-emerald-500/90 text-white shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
                  title="Preview Lesson"
                >
                  <PlayCircle className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Floating 'Ask a Mentor' Button inside Modal */}
            <div className="absolute bottom-4 right-4 z-20">
              <button
                onClick={() => setShowAskMentorModal(true)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-950/50 flex items-center gap-2 ring-2 ring-emerald-300/40 hover:scale-105 transition-all"
              >
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                </div>
                <span>Ask a Mentor 👨‍🏫</span>
              </button>
            </div>
          </div>

          {/* Modal Navigation */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Course Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === "curriculum"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Syllabus & Lessons
            </button>
            <button
              onClick={() => setActiveTab("instructor")}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === "instructor"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Instructor Info
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Visual Course Progress Bar for Enrolled Students */}
            {enrollmentStatus === "approved" && (
              <CourseProgress
                course={course}
                completedCourseIds={completedCourseIds}
                onToggleComplete={onToggleCompleteCourse}
              />
            )}

            {/* Notice for Payment requirement */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-gray-900 dark:text-white">
                  Ethiopian Course Fee Transfer (Telebirr, CBE Birr & CBE Bank)
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  Fee ranges from <strong>1,500 ETB to 2,500 ETB</strong> depending on the course. Transfer your course fee via <strong>Telebirr (0906521758)</strong>, <strong>CBE Birr (0906521758)</strong>, or <strong>CBE Bank Transfer (1000425428016)</strong>, upload your receipt, and start studying immediately!
                </p>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2">
                    About This Course
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-3">
                    What You'll Learn
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {course.learnings.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2">
                    Prerequisites
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {course.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-4">
                <p className="text-gray-500 text-xs">
                  {course.modules.length > 0
                    ? `${course.modules.length} Modules • ${course.lessonsCount} Video Lessons`
                    : "Complete syllabus structured into self-paced video modules, code exercises, and AI Tutor quizzes."}
                </p>

                {course.modules.length > 0 ? (
                  course.modules.map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-2">
                      <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                        <span>{m.title}</span>
                        <span className="text-gray-400 font-normal">{m.duration}</span>
                      </div>
                      <div className="space-y-1 pt-1">
                        {m.lessons.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                          >
                            <span className="flex items-center gap-2">
                              {l.isPreview || enrollmentStatus === "approved" ? (
                                <PlayCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                              {l.title}
                            </span>
                            <span className="text-gray-400">{l.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <p className="font-bold">Module 1: Introduction & Environment Setup</p>
                    <p className="text-gray-400 mt-1">Includes 12 video lessons, source code downloads, and homework assignments.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      {course.instructor.name}
                    </h4>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      🇪🇹 Instructor
                    </span>
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{course.instructor.title}</p>
                  <p className="text-gray-500 text-[11px]">{course.instructor.company}</p>
                  <p className="text-gray-600 dark:text-gray-300 pt-2 leading-relaxed">
                    Passionate tech educator with over 10 years of software architectural experience. Guided 34,000+ students globally into tech careers.
                  </p>
                  <button
                    onClick={() => setShowAskMentorModal(true)}
                    className="mt-2 text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Start Direct Chat with {course.instructor.name}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{course.price.toLocaleString()} ETB</p>
                {course.originalPrice && (
                  <p className="text-xs text-gray-400 line-through font-medium">{course.originalPrice.toLocaleString()} ETB</p>
                )}
              </div>
              <p className="text-[10px] text-emerald-600 font-bold">Telebirr/CBE Birr (0906521758) • CBE Bank (1000425428016)</p>
            </div>

            <div className="flex items-center gap-2">
              {enrollmentStatus === "approved" && (
                <button
                  onClick={() => {
                    onClose();
                    onViewCertificate();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                >
                  <Award className="w-4 h-4" /> View Certificate
                </button>
              )}

              {enrollmentStatus === "approved" ? (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Enrolled (Resume Learning 🚀)
                </button>
              ) : enrollmentStatus === "pending_approval" ? (
                <button
                  onClick={() => onEnrollClick(course)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4 animate-spin" /> Receipt Uploaded (Pending Admin Approval)
                </button>
              ) : (
                <button
                  onClick={() => onEnrollClick(course)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Pay Fee & Upload Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Ask Mentor Modal */}
      {showAskMentorModal && (
        <AskMentorModal course={course} onClose={() => setShowAskMentorModal(false)} />
      )}
    </>
  );
};
