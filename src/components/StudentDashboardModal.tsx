import React, { useState } from "react";
import {
  X,
  GraduationCap,
  BookOpen,
  Trophy,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ArrowRight,
  Flame,
  Plus,
  Play,
  Settings,
  Bell,
  Mail,
  Check,
  ShieldCheck,
  Download,
  FileJson,
  Moon,
  Sun,
  Timer,
  Brain,
  Zap,
  Printer,
} from "lucide-react";
import { Course, User, PaymentReceipt } from "../types";
import { CourseProgress } from "./CourseProgress";
import { UserBadges, BADGES } from "./UserBadges";
import { StudyTimerWidget } from "./StudyTimerWidget";
import { DailyQuizWidget } from "./DailyQuizWidget";
import { DailyQuizModal } from "./DailyQuizModal";
import { DailyStreakWidget } from "./DailyStreakWidget";

interface StudentDashboardModalProps {
  user: User;
  courses: Course[];
  receipts: PaymentReceipt[];
  onClose: () => void;
  onOpenCourse: (course: Course) => void;
  onOpenCertificates: () => void;
  onOpenPaymentModal: () => void;
  onToggleCompleteCourse: (courseId: string) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  user,
  courses,
  receipts,
  onClose,
  onOpenCourse,
  onOpenCertificates,
  onOpenPaymentModal,
  onToggleCompleteCourse,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "streak" | "timer" | "quiz" | "courses" | "payments" | "badges" | "settings"
  >("overview");

  const [isDailyQuizModalOpen, setIsDailyQuizModalOpen] = useState(false);

  // Dark mode state with persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark") || user.darkMode === true;
  });

  const handleToggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        darkMode: nextVal,
      });
    }
    setSavedMessage(`Dark mode preference updated to ${nextVal ? "Dark Theme 🌙" : "Light Theme ☀️"}!`);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // Daily quiz points handler
  const handleQuizCompleted = (earnedPoints: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (onUpdateUser) {
      const currentPoints = user.streakPoints || 150;
      const currentStreak = user.dailyStreak || 3;
      onUpdateUser({
        ...user,
        streakPoints: currentPoints + earnedPoints,
        dailyStreak: currentStreak + 1,
        lastQuizCompletedDate: todayStr,
      });
    }
    setSavedMessage(`🎉 Quiz Completed! +${earnedPoints} XP awarded & streak incremented!`);
    setTimeout(() => setSavedMessage(null), 4000);
  };

  // Notification settings local state
  const [emailNotifications, setEmailNotifications] = useState({
    courseApproval: user.emailNotifications?.courseApproval ?? true,
    newCourses: user.emailNotifications?.newCourses ?? true,
    weeklyDigest: user.emailNotifications?.weeklyDigest ?? true,
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleToggleNotification = (
    key: "courseApproval" | "newCourses" | "weeklyDigest"
  ) => {
    const updated = {
      ...emailNotifications,
      [key]: !emailNotifications[key],
    };
    setEmailNotifications(updated);
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        emailNotifications: updated,
      });
    }
    setSavedMessage("Notification settings saved successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  // Filter user's enrolled courses with safe checks
  const enrolledCourseIds = user.enrolledCourseIds || [];
  const enrolledCourses = courses.filter((c) =>
    enrolledCourseIds.includes(c.id)
  );

  // User's payment receipts with safe checks
  const userEmail = (user.email || "").toLowerCase();
  const userReceipts = receipts.filter(
    (r) => (r.studentEmail || "").toLowerCase() === userEmail
  );

  // Completion metrics
  const completedCount = user.completedCourseIds?.length || 0;
  const enrolledCount = enrolledCourseIds.length;

  // Export enrollment data and course history to JSON file
  const handleExportJSON = () => {
    const exportData = {
      app: "Yacob Tech LMS",
      exportVersion: "1.0",
      exportedAt: new Date().toISOString(),
      studentProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        subscriptionStatus: "Active",
      },
      summaryStats: {
        enrolledCoursesCount: enrolledCourses.length,
        completedCoursesCount: completedCount,
        paymentReceiptsCount: userReceipts.length,
      },
      enrolledCourses: enrolledCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        duration: c.duration,
        instructor: c.instructor,
        price: c.price,
        rating: c.rating,
        isCompleted: user.completedCourseIds?.includes(c.id) || false,
      })),
      completedCourseIds: user.completedCourseIds || [],
      paymentReceipts: userReceipts.map((r) => ({
        id: r.id,
        transactionRef: r.transactionRef,
        courseTitle: r.courseTitle,
        amountPaid: r.amountPaid,
        paymentMethod: r.paymentMethod,
        status: r.status,
        submittedAt: r.submittedAt,
      })),
      notificationPreferences: emailNotifications,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_enrollment_history_${user.name.toLowerCase().replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print Summary Handler: generates formatted printable document of progress, badges & streak
  const handlePrintSummary = () => {
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      alert("Please enable popup windows to print your student learning summary.");
      return;
    }

    const completedCount = user.completedCourseIds?.length || 0;
    const enrolledCount = enrolledCourses.length;
    const streakDays = user.dailyStreak || 3;
    const streakPoints = user.streakPoints || 150;

    const unlockedBadges = BADGES.filter((b) => b.isUnlocked(user));

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Student Academic Progress Summary - ${user.name || "Yaikob Diriba"}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
            }
            .header-banner {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 20px;
              border-bottom: 4px solid #10b981;
              margin-bottom: 24px;
            }
            .brand-title {
              font-size: 26px;
              font-weight: 900;
              color: #065f46;
              letter-spacing: -0.5px;
            }
            .brand-subtitle {
              font-size: 13px;
              color: #64748b;
              font-weight: 600;
              margin-top: 2px;
            }
            .student-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px;
              margin-bottom: 24px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .info-item { font-size: 13px; color: #334155; }
            .info-label { font-weight: 800; color: #64748b; text-transform: uppercase; font-size: 10px; display: block; margin-bottom: 2px; }
            .info-value { font-weight: 700; color: #0f172a; }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 14px;
              margin-bottom: 28px;
            }
            .stat-box {
              background: #f0fdf4;
              border: 1px solid #a7f3d0;
              border-radius: 14px;
              padding: 16px 12px;
              text-align: center;
            }
            .stat-num { font-size: 24px; font-weight: 900; color: #047857; font-family: monospace; }
            .stat-lbl { font-size: 11px; font-weight: 800; color: #065f46; text-transform: uppercase; margin-top: 4px; }

            .section-heading {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 8px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 28px;
              font-size: 13px;
            }
            th {
              background: #f1f5f9;
              color: #475569;
              font-weight: 800;
              text-align: left;
              padding: 10px 14px;
              border-bottom: 2px solid #cbd5e1;
            }
            td {
              padding: 12px 14px;
              border-bottom: 1px solid #e2e8f0;
              color: #1e293b;
            }
            .p-bar-bg { background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 4px; }
            .p-bar-fill { background: #10b981; height: 100%; border-radius: 5px; }

            .badges-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-bottom: 28px;
            }
            .badge-item {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 14px;
              background: #ffffff;
            }
            .badge-item.active {
              border-color: #10b981;
              background: #f0fdf4;
            }
            .badge-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .badge-title { font-weight: 800; font-size: 14px; color: #0f172a; }
            .badge-tag { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; }
            .tag-unlocked { background: #10b981; color: #ffffff; }
            .tag-locked { background: #cbd5e1; color: #475569; }
            .badge-desc { font-size: 12px; color: #64748b; }

            .footer-note {
              border-top: 1px solid #e2e8f0;
              padding-top: 18px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              margin-top: 40px;
            }

            .print-btn {
              background: #10b981;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 10px;
              font-weight: 800;
              font-size: 13px;
              cursor: pointer;
            }

            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <div class="brand-title">🎓 Yacob Tech Academy</div>
              <div class="brand-subtitle">Official Student Academic Progress & Daily Streak Summary</div>
            </div>
            <button class="print-btn no-print" onclick="window.print()">
              🖨️ Print / Save PDF
            </button>
          </div>

          <div class="student-card">
            <div class="info-item">
              <span class="info-label">Student Full Name</span>
              <span class="info-value">${user.name || "Yaikob Diriba"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email Address</span>
              <span class="info-value">${user.email || "yaikobdiriba22@gmail.com"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contact Phone</span>
              <span class="info-value">${user.phone || "0922067302"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Address / Location</span>
              <span class="info-value">${user.address || "Addis Ababa, Ethiopia"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Membership Tier</span>
              <span class="info-value">${user.plan || "Pro"} Student (${user.role || "Student"})</span>
            </div>
            <div class="info-item">
              <span class="info-label">Report Date</span>
              <span class="info-value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-num">🔥 ${streakDays}d</div>
              <div class="stat-lbl">Active Streak</div>
            </div>
            <div class="stat-box">
              <div class="stat-num">${completedCount} / ${enrolledCount}</div>
              <div class="stat-lbl">Courses Completed</div>
            </div>
            <div class="stat-box">
              <div class="stat-num">⚡ ${streakPoints}</div>
              <div class="stat-lbl">Total XP Points</div>
            </div>
            <div class="stat-box">
              <div class="stat-num">🏅 ${unlockedBadges.length} / ${BADGES.length}</div>
              <div class="stat-lbl">Badges Unlocked</div>
            </div>
          </div>

          <div class="section-heading">
            <span>Enrolled Courses & Module Completion</span>
            <span style="font-size:12px; color:#64748b;">${enrolledCount} Courses Tracked</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Category</th>
                <th>Module Completion</th>
                <th>Progress %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${enrolledCourses.map((c) => {
                const totalM = c.modules?.length || 5;
                const isC = (user.completedCourseIds || []).includes(c.id);
                const compM = isC ? totalM : Math.min(totalM, Math.ceil(totalM * 0.6));
                const pct = Math.round((compM / totalM) * 100);
                return `
                  <tr>
                    <td><strong>${c.title}</strong></td>
                    <td>${c.category}</td>
                    <td>${compM} of ${totalM} Modules</td>
                    <td style="width: 140px;">
                      <div style="font-weight: 800; font-size: 11px;">${pct}%</div>
                      <div class="p-bar-bg"><div class="p-bar-fill" style="width: ${pct}%;"></div></div>
                    </td>
                    <td>${isC ? '<span style="color:#047857; font-weight:800;">Completed 🎉</span>' : '<span style="color:#2563eb; font-weight:700;">In Progress</span>'}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>

          <div class="section-heading">
            <span>Achievement Badges & Milestones</span>
            <span style="font-size:12px; color:#64748b;">${unlockedBadges.length} Unlocked</span>
          </div>

          <div class="badges-grid">
            ${BADGES.map((b) => {
              const unlocked = b.isUnlocked(user);
              return `
                <div class="badge-item ${unlocked ? 'active' : ''}">
                  <div class="badge-head">
                    <span class="badge-title">${unlocked ? '🏅' : '🔒'} ${b.name}</span>
                    <span class="badge-tag ${unlocked ? 'tag-unlocked' : 'tag-locked'}">
                      ${unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <div class="badge-desc">${b.description}</div>
                </div>
              `;
            }).join("")}
          </div>

          <div class="footer-note">
            Official Academic Record • Yacob Tech Academy • Addis Ababa, Ethiopia • Tel: 0922067302
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-2xl border-2 border-emerald-400/50 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black">{user.name}'s Student Workspace</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
                  🎓 Student Role
                </span>
                {user.role !== "Admin" && (
                  user.isApproved ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Admin Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3 text-amber-300" /> Pending Approval
                    </span>
                  )
                )}
                {user.isEmailVerified ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Email Verified
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (onUpdateUser) {
                        onUpdateUser({ ...user, isEmailVerified: true });
                        setSavedMessage("Your email has been verified successfully!");
                        setTimeout(() => setSavedMessage(null), 3000);
                      }
                    }}
                    className="px-2 py-0.5 rounded-full bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 border border-amber-400/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                    title="Click to confirm and verify email"
                  >
                    <Mail className="w-3 h-3 text-amber-300" /> Verify Email Now
                  </button>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 flex flex-wrap items-center gap-2">
                <span>{user.email || "yaikobdiriba22@gmail.com"}</span>
                <span>•</span>
                <span>📞 {user.phone || "0922067302"}</span>
                <span>•</span>
                <span>📍 {user.address || "Addis Ababa"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDailyQuizModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.03] animate-pulse"
              title="Open Daily Tech Quiz Modal to boost streak & earn bonus XP"
            >
              <Brain className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Daily Quiz Modal 🧠</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Export enrollment data & course history to JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export Data</span>
            </button>

            <button
              onClick={handlePrintSummary}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Print formatted learning summary, module progress, badges & streak"
            >
              <Printer className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Print Summary</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pending Approval Warning Banner */}
        {user.role !== "Admin" && user.isApproved === false && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 flex items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shrink-0">
            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0 animate-bounce" />
              <div>
                <p className="text-xs font-extrabold flex items-center gap-1.5">
                  ⏳ Student Account Registration Pending Admin Approval
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300 mt-0.5">
                  Your registration has been logged and is awaiting administrator verification. Contact academy admin at <strong>0906521758</strong> or Telebirr account <strong>0906521758</strong> for instant verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 overflow-x-auto shrink-0 px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab("streak")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "streak"
                ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300" /> Daily Streak ({user.dailyStreak || 3} Days) 🔥
          </button>

          <button
            onClick={() => setActiveTab("timer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "timer"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Timer className="w-4 h-4 text-emerald-500 dark:text-emerald-300" /> Study Timer ⏱️
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "quiz"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Brain className="w-4 h-4 text-amber-500" /> Daily Quiz 🧠
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "courses"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Courses ({enrolledCount})
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "payments"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" /> Fee Receipts ({userReceipts.length})
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "badges"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" /> Badges & Medals
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" /> User Settings
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{enrolledCount}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Enrolled Courses</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Mastery</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{completedCount}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Finished Courses</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-1">
                  <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Points</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{user.streakPoints || 150} XP</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Quiz Points</p>
                </div>

                <div
                  onClick={() => setActiveTab("streak")}
                  className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-1 cursor-pointer hover:border-rose-500 transition-all group"
                >
                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                    <Flame className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Streak 🔥</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{user.dailyStreak || 3} Days</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <span>Daily Learning</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold group-hover:underline">Track →</span>
                  </p>
                </div>
              </div>

              {/* Daily Learning Streak Widget Section on Overview */}
              <DailyStreakWidget user={user} onUpdateUser={onUpdateUser} />

              {/* Study Timer Widget Section on Overview */}
              <StudyTimerWidget enrolledCourses={enrolledCourses} />

              {/* Achievements & Badges Compact Banner */}
              <UserBadges user={user} variant="compact" />

              {/* Daily Quiz Widget Section on Overview */}
              <DailyQuizWidget user={user} courses={courses} onQuizCompleted={handleQuizCompleted} />

              {/* Enrolled Courses Highlights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    My Learning Progress
                  </h3>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                  >
                    View All Enrolled <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {enrolledCourses.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
                    <p className="font-bold">No enrolled courses yet!</p>
                    <p className="text-xs mt-1">Browse our full tech catalog and start learning today.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-16 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <h4 className="font-extrabold text-gray-900 dark:text-white">{course.title}</h4>
                              <p className="text-[11px] text-gray-500">
                                {typeof course.instructor === "string" ? course.instructor : course.instructor?.name || "Instructor"} • {course.level}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                onOpenCourse(course);
                                onClose();
                              }}
                              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Continue Study
                            </button>
                          </div>
                        </div>

                        {/* Visual Progress Bar calculated on completed vs total lessons */}
                        <CourseProgress
                          course={course}
                          completedCourseIds={user.completedCourseIds || []}
                          onToggleComplete={onToggleCompleteCourse}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: DAILY STREAK */}
          {activeTab === "streak" && (
            <div className="space-y-4">
              <DailyStreakWidget user={user} onUpdateUser={onUpdateUser} />
            </div>
          )}

          {/* TAB: STUDY TIMER */}
          {activeTab === "timer" && (
            <div className="space-y-4">
              <StudyTimerWidget enrolledCourses={enrolledCourses} />
            </div>
          )}

          {/* TAB: DAILY QUIZ */}
          {activeTab === "quiz" && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase">
                      New Feature
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                      Daily Tech Challenge Modal 🧠
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Open the full-screen daily quiz modal to test your skills in React 19, MERN Stack, and Web Security!
                  </p>
                </div>

                <button
                  onClick={() => setIsDailyQuizModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
                >
                  <Brain className="w-4 h-4 text-white" />
                  <span>Launch Daily Quiz Modal 🧠</span>
                </button>
              </div>

              <DailyQuizWidget user={user} courses={courses} onQuizCompleted={handleQuizCompleted} />
            </div>
          )}

          {/* TAB 2: COURSES & PROGRESS */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Detailed Course Completion Tracks
              </h3>

              {enrolledCourses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">You are not enrolled in any courses.</p>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-14 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              {course.category} • {course.duration}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onOpenCourse(course);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-gray-800 dark:text-gray-200 hover:text-emerald-600 font-bold text-xs"
                        >
                          Open Course →
                        </button>
                      </div>

                      {/* Course Completion Progress Bar */}
                      <CourseProgress
                        course={course}
                        completedCourseIds={user.completedCourseIds || []}
                        onToggleComplete={onToggleCompleteCourse}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FEE RECEIPTS & PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Telebirr, CBE Birr & CBE Bank Payment Submissions
                  </h3>
                  <p className="text-gray-500 text-[11px]">
                    Track payment approval status (Telebirr/CBE Birr: 0906521758 | CBE Bank: 1000425428016)
                  </p>
                </div>
                <button
                  onClick={() => {
                    onOpenPaymentModal();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" /> Submit New Receipt
                </button>
              </div>

              {userReceipts.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 space-y-2">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="font-bold">No receipt submissions found for your email.</p>
                  <p className="text-xs">
                    Need course access? Transfer fee via Telebirr (0906521758), CBE Birr (0906521758), or CBE Bank Transfer (1000425428016) and submit your transaction reference.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReceipts.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                            {r.transactionRef}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              r.status === "Approved"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                                : r.status === "Rejected"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">
                          Course: {r.courseTitle} ({r.paymentMethod} - {r.amountPaid} ETB)
                        </p>
                        <p className="text-gray-400 text-[10px]">Submitted on {r.submittedAt}</p>
                      </div>

                      {r.status === "Approved" ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Verified & Enrolled
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Awaiting Admin Approval
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BADGES & MEDALS */}
          {activeTab === "badges" && (
            <UserBadges user={user} variant="full" />
          )}

          {/* TAB 5: USER SETTINGS & EMAIL NOTIFICATIONS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Student Account & Notification Preferences
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Manage your email alert preferences for course approvals and platform announcements.
                </p>
              </div>

              {savedMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-xs font-bold animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{savedMessage}</span>
                </div>
              )}

              {/* Appearance & Dark Mode Preference Panel */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                      Appearance & Dark Mode Preference
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Persist your preferred visual theme independently of device or OS settings.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <h5 className="font-extrabold text-xs text-gray-900 dark:text-white">
                        Dark Theme Mode
                      </h5>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      {isDarkMode
                        ? "Dark Mode is ACTIVE (Ideal for night study & OLED screens)"
                        : "Light Mode is ACTIVE (High contrast daytime layout)"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleDarkMode}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isDarkMode ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={isDarkMode}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isDarkMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Email Notifications Panel */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                      Email Notification Controls
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Deliver updates to <span className="font-semibold text-gray-700 dark:text-gray-300">{user.email}</span>
                    </p>
                  </div>
                </div>

                {/* Option 1: Course Approval */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <h5 className="font-extrabold text-xs text-gray-900 dark:text-white">
                        Course Approval Notifications
                      </h5>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      Receive instant email alerts when your payment receipts or enrollment requests are verified by Yacob Tech admins.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotification("courseApproval")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailNotifications.courseApproval
                        ? "bg-emerald-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={emailNotifications.courseApproval}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailNotifications.courseApproval ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Option 2: New Course Announcements */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                      <h5 className="font-extrabold text-xs text-gray-900 dark:text-white">
                        New Course Announcements
                      </h5>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      Get notified when new tech specializations, MERN Stack tracks, or coding tutorials are launched on the platform.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotification("newCourses")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailNotifications.newCourses
                        ? "bg-emerald-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={emailNotifications.newCourses}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailNotifications.newCourses ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Option 3: Weekly Digest */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <h5 className="font-extrabold text-xs text-gray-900 dark:text-white">
                        Weekly Study Progress & Digest
                      </h5>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                      Receive weekly summaries of your learning streak, completed lessons, and personalized practice recommendations.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleNotification("weeklyDigest")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailNotifications.weeklyDigest
                        ? "bg-emerald-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    role="switch"
                    aria-checked={emailNotifications.weeklyDigest}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emailNotifications.weeklyDigest ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Data Export & Backup Panel */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3 shadow-sm">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                      Data Export & Local Backup
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Download a copy of your course enrollments, completion records, and fee payment receipts in standard JSON format.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Student Enrollment & Course History File
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Includes {enrolledCourses.length} enrolled courses, {completedCount} completed tracks, and {userReceipts.length} transaction receipts.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON Data
                  </button>
                </div>
              </div>

              {/* Student Profile Card */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">{user.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      {user.email || "yaikobdiriba22@gmail.com"} • 📞 {user.phone || "0922067302"} • 📍 {user.address || "Addis Ababa"}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300/50">
                  {user.plan} Member
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Tech Quiz Modal Popup */}
      <DailyQuizModal
        isOpen={isDailyQuizModalOpen}
        onClose={() => setIsDailyQuizModalOpen(false)}
        user={user}
        onQuizCompleted={handleQuizCompleted}
      />
    </div>
  );
};
