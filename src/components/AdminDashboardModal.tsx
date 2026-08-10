import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  AlertCircle,
  FileText,
  UserCheck,
  Plus,
  Trash2,
  Edit,
  BookOpen,
  Users,
  DollarSign,
  Award,
  Settings,
  TrendingUp,
  Building2,
  Lock,
  Unlock,
  Check,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
} from "lucide-react";
import { PaymentReceipt, Course, User } from "../types";

interface AdminDashboardModalProps {
  receipts: PaymentReceipt[];
  courses: Course[];
  enrolledCourseIds: string[];
  currentUser: User | null;
  onApproveReceipt: (receiptId: string) => void;
  onRejectReceipt: (receiptId: string) => void;
  onDeleteReceipt: (receiptId: string) => void;
  onAddManualReceipt: (receipt: PaymentReceipt) => void;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onGrantAccess: (courseId: string) => void;
  onRevokeAccess: (courseId: string) => void;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  receipts,
  courses,
  enrolledCourseIds,
  currentUser,
  onApproveReceipt,
  onRejectReceipt,
  onDeleteReceipt,
  onAddManualReceipt,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onGrantAccess,
  onRevokeAccess,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "receipts" | "courses" | "students" | "analytics"
  >("receipts");

  const [chartMetric, setChartMetric] = useState<"receipts" | "revenue">("receipts");

  // Receipt filters
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Course management state
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New Course Form state
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("Software Development");
  const [newCoursePrice, setNewCoursePrice] = useState<number>(2000);
  const [newCourseLevel, setNewCourseLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [newCourseDuration, setNewCourseDuration] = useState("18 Hours");
  const [newCourseInstructor, setNewCourseInstructor] = useState("Abebe Bikila");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseImage, setNewCourseImage] = useState(
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  );

  // Manual payment entry state
  const [showManualPayModal, setShowManualPayModal] = useState(false);
  const [manualStudentName, setManualStudentName] = useState("");
  const [manualStudentEmail, setManualStudentEmail] = useState("");
  const [manualCourseId, setManualCourseId] = useState(courses[0]?.id || "");
  const [manualPaymentMethod, setManualPaymentMethod] = useState<
    "Telebirr" | "CBE Birr" | "CBE Bank Transfer" | string
  >("Telebirr");
  const [manualRef, setManualRef] = useState(`MANUAL-${Date.now().toString().slice(-6)}`);

  // System Settings state
  const [requireReceiptApproval, setRequireReceiptApproval] = useState(true);
  const [autoCertificateEnabled, setAutoCertificateEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Calculations
  const totalApprovedEtb = receipts
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.amountEtb, 0);

  const pendingCount = receipts.filter((r) => r.status === "pending").length;

  // 7-Day Payment Receipts Recharts Analytics Calculation
  const last7DaysReceiptsData = useMemo(() => {
    const days: Array<{
      dateKey: string;
      day: string;
      totalReceipts: number;
      approved: number;
      pending: number;
      rejected: number;
      revenueEtb: number;
    }> = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dateKey = d.toISOString().split("T")[0];

      days.push({
        dateKey,
        day: dayStr,
        totalReceipts: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        revenueEtb: 0,
      });
    }

    // Process receipts into 7 days
    receipts.forEach((r, idx) => {
      let matchedIdx = -1;
      if (r.submittedAt) {
        const parsed = Date.parse(r.submittedAt);
        if (!isNaN(parsed)) {
          const iso = new Date(parsed).toISOString().split("T")[0];
          matchedIdx = days.findIndex((d) => d.dateKey === iso);
        }
      }

      if (matchedIdx === -1) {
        // Fallback index spread over 7 days if timestamp is unparsed
        matchedIdx = (6 - (idx % 7));
      }

      const dayObj = days[matchedIdx];
      if (dayObj) {
        dayObj.totalReceipts += 1;
        if (r.status === "approved") {
          dayObj.approved += 1;
          dayObj.revenueEtb += r.amountEtb || (r.amountUsd ? r.amountUsd * 130 : 8970);
        } else if (r.status === "pending") {
          dayObj.pending += 1;
        } else if (r.status === "rejected") {
          dayObj.rejected += 1;
        }
      }
    });

    return days;
  }, [receipts]);

  // Payment Method Breakdown for PieChart
  const paymentMethodData = useMemo(() => {
    const methodCounts: Record<string, number> = {
      Telebirr: 0,
      "CBE Birr": 0,
      "CBE Bank Transfer": 0,
    };

    receipts.forEach((r) => {
      const m = r.paymentMethod || "Telebirr";
      methodCounts[m] = (methodCounts[m] || 0) + 1;
    });

    const colorMap: Record<string, string> = {
      Telebirr: "#10b981", // Emerald
      "CBE Birr": "#8b5cf6", // Purple
      "CBE Bank Transfer": "#3b82f6", // Blue
    };

    return Object.entries(methodCounts).map(([name, value]) => ({
      name,
      value: value || (name === "CBE" ? 1 : name === "Telebirr" ? 1 : 0),
      color: colorMap[name] || "#6b7280",
    }));
  }, [receipts]);

  const filteredReceipts = receipts.filter((r) => {
    const matchesFilter =
      filterStatus === "all" ? true : r.status === filterStatus;
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      subtitle: "Hands-on Masterclass for Ethiopian Developers & Tech Creators",
      description:
        newCourseDescription ||
        "Comprehensive hands-on curriculum tailored for tech leaders and students in Ethiopia.",
      category: newCourseCategory,
      categoryId: "cat-software",
      price: Number(newCoursePrice),
      rating: 4.9,
      reviewsCount: 1,
      studentsEnrolled: 0,
      duration: newCourseDuration,
      lessonsCount: 24,
      level: newCourseLevel,
      image: newCourseImage,
      tags: ["Ethiopia Tech", newCourseCategory, "Practical"],
      lastUpdated: "July 2026",
      certificateProvided: true,
      instructor: {
        id: `inst-${Date.now()}`,
        name: newCourseInstructor,
        title: "Senior Tech Lead & Instructor",
        company: "Yacob Tech Academy Ethiopia",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 4.9,
        studentsCount: 1200,
        coursesCount: 5,
      },
      learnings: [
        "Master industry best practices",
        "Build 3 full-stack portfolio projects",
        "Prepare for high-paying remote tech jobs",
      ],
      requirements: ["Basic computer literacy", "Interest in technology"],
      modules: [],
    };

    onAddCourse(newCourseObj);
    setShowAddCourseForm(false);

    // Reset Form
    setNewCourseTitle("");
    setNewCourseDescription("");
    setNewCoursePrice(49);
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    onUpdateCourse(editingCourse);
    setEditingCourse(null);
  };

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourse = courses.find((c) => c.id === manualCourseId) || courses[0];
    if (!targetCourse) return;

    const etb = targetCourse.price;

    const manualReceipt: PaymentReceipt = {
      id: `rcpt-manual-${Date.now()}`,
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      studentName: manualStudentName || "Student",
      studentEmail: manualStudentEmail || "student@example.com",
      amountUsd: 0,
      amountEtb: etb,
      paymentMethod: manualPaymentMethod,
      transactionRef: manualRef,
      submittedAt: new Date().toLocaleString(),
      status: "approved", // Instantly approve
      notes: "Manual Cash / Offline Admin Approval",
    };

    onAddManualReceipt(manualReceipt);
    onGrantAccess(targetCourse.id);
    setShowManualPayModal(false);
    setManualStudentName("");
    setManualStudentEmail("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-950 via-emerald-950 to-gray-950 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold">
                  Yacob Tech Master Admin Dashboard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  🇪🇹 Full System Control
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Verify Telebirr/CBE payments, add or edit courses, control student enrollment access & platform settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("receipts")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === "receipts"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Payment Receipts ({receipts.length})</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === "courses"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === "students"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Access ({enrolledCourseIds.length} Unlocked)</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              activeTab === "analytics"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics & Settings</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TAB 1: RECEIPT APPROVALS */}
          {activeTab === "receipts" && (
            <div className="space-y-4">
              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      filterStatus === "pending"
                        ? "bg-amber-500 text-white shadow"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" /> Pending ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilterStatus("approved")}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                      filterStatus === "approved"
                        ? "bg-emerald-600 text-white shadow"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </button>
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      filterStatus === "all"
                        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    All ({receipts.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ref ID, student, course..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <button
                    onClick={() => setShowManualPayModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Manual Payment
                  </button>
                </div>
              </div>

              {/* Receipts List */}
              {filteredReceipts.length === 0 ? (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
                  <AlertCircle className="w-10 h-10 mx-auto text-gray-400" />
                  <p className="font-bold text-sm">No receipts match this filter.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredReceipts.map((rcpt) => (
                    <div
                      key={rcpt.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-emerald-500/50"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                            {rcpt.studentName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                            {rcpt.paymentMethod}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rcpt.status === "pending"
                                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                                : rcpt.status === "approved"
                                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                                : "bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {rcpt.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 font-semibold line-clamp-1">
                          Course: {rcpt.courseTitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                          <span>
                            Ref ID:{" "}
                            <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                              {rcpt.transactionRef}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Amount:{" "}
                            <strong className="text-gray-900 dark:text-white">
                              {rcpt.amountEtb.toLocaleString()} ETB
                            </strong>
                          </span>
                          <span>•</span>
                          <span>{rcpt.submittedAt}</span>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setSelectedReceipt(rcpt)}
                          className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>

                        {rcpt.status === "pending" && (
                          <>
                            <button
                              onClick={() => onApproveReceipt(rcpt.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => onRejectReceipt(rcpt.id)}
                              className="px-3 py-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 font-bold text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => onDeleteReceipt(rcpt.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Receipt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSE CATALOG MANAGEMENT (CRUD) */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                    Manage Academy Courses
                  </h3>
                  <p className="text-gray-500 text-[11px]">
                    Create new courses, update Ethiopian ETB prices, or delete outdated modules
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCourseForm(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" /> Add New Course
                </button>
              </div>

              {/* Add Course Form Modal/Drawer */}
              {showAddCourseForm && (
                <form
                  onSubmit={handleSaveNewCourse}
                  className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Create New Academy Course
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddCourseForm(false)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        placeholder="e.g. Ethiopian Mobile App Dev with Flutter"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Category *
                      </label>
                      <select
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      >
                        <option value="Software Development">Software Development</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Data Science & Analytics">Data Science & Analytics</option>
                        <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Course Fee (ETB Birr - Min 1,500, Max 2,500) *
                      </label>
                      <input
                        type="number"
                        min={1500}
                        max={2500}
                        required
                        value={newCoursePrice}
                        onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                      <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                        Fee: {newCoursePrice.toLocaleString()} ETB
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={newCourseDuration}
                        onChange={(e) => setNewCourseDuration(e.target.value)}
                        placeholder="e.g. 16 Hours"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Instructor Name
                      </label>
                      <input
                        type="text"
                        value={newCourseInstructor}
                        onChange={(e) => setNewCourseInstructor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newCourseDescription}
                      onChange={(e) => setNewCourseDescription(e.target.value)}
                      placeholder="Brief overview of course outcome..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCourseForm(false)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
                    >
                      Publish Course
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Course Overlay Form */}
              {editingCourse && (
                <form
                  onSubmit={handleSaveEditCourse}
                  className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800 pb-2">
                    <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Edit className="w-4 h-4" /> Editing: {editingCourse.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingCourse.title}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Course Fee (ETB Birr - Min 1,500, Max 2,500)
                      </label>
                      <input
                        type="number"
                        min={1500}
                        max={2500}
                        value={editingCourse.price}
                        onChange={(e) =>
                          setEditingCourse({
                            ...editingCourse,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
                      />
                      <span className="text-[10px] text-amber-700 font-bold mt-0.5 block">
                        Fee: {editingCourse.price.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Courses Grid */}
              <div className="grid gap-3">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-16 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          {c.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                          <span>
                            Fee: <strong className="text-gray-900 dark:text-white">{c.price.toLocaleString()} ETB</strong>
                          </span>
                          <span>•</span>
                          <span>Instructor: {c.instructor.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setEditingCourse(c)}
                        className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => onDeleteCourse(c.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT & ENROLLMENT ACCESS MANAGEMENT */}
          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                    Direct Student Course Access Control
                  </h3>
                  <p className="text-gray-500 text-[11px]">
                    Admin can manually grant or revoke full video lesson and certificate access for any course.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {courses.map((course) => {
                  const isUnlocked = enrolledCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                            {course.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> Access Granted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-[10px] flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked (Requires Fee)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Fee: <strong className="text-gray-900 dark:text-white">{course.price.toLocaleString()} ETB</strong>
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          <button
                            onClick={() => onRevokeAccess(course.id)}
                            className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-200"
                          >
                            Revoke Student Access
                          </button>
                        ) : (
                          <button
                            onClick={() => onGrantAccess(course.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                          >
                            Grant Free Access
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM ANALYTICS & PLATFORM SETTINGS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Analytics Metric Cards */}
              <div className="grid sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                    Total Revenue (ETB)
                  </p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                    {totalApprovedEtb.toLocaleString()} ETB
                  </p>
                  <p className="text-[10px] text-emerald-600">Approved Bank Transfers</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400">
                    7-Day Total Receipts
                  </p>
                  <p className="text-2xl font-black text-purple-900 dark:text-purple-100">
                    {last7DaysReceiptsData.reduce((acc, d) => acc + d.totalReceipts, 0)}
                  </p>
                  <p className="text-[10px] text-purple-600">
                    {pendingCount} Awaiting Review
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">
                    Active Courses
                  </p>
                  <p className="text-2xl font-black text-blue-900 dark:text-blue-100">
                    {courses.length}
                  </p>
                  <p className="text-[10px] text-blue-600">In Academy Catalog</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
                    Course Fee Limits
                  </p>
                  <p className="text-2xl font-black text-amber-900 dark:text-amber-100">
                    1,500 - 2,500 ETB
                  </p>
                  <p className="text-[10px] text-amber-600">Strictly Ethiopian Birr (ETB)</p>
                </div>
              </div>

              {/* RECHARTS SECTION: Daily Payment Receipts (Last 7 Days) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                        Daily Payment Receipts Received
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                          Last 7 Days
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Visualizing daily submitted receipts broken down by status (Approved, Pending, Rejected)
                      </p>
                    </div>
                  </div>

                  {/* Toggle Metric View */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold shrink-0">
                    <button
                      onClick={() => setChartMetric("receipts")}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        chartMetric === "receipts"
                          ? "bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Receipts Count
                    </button>
                    <button
                      onClick={() => setChartMetric("revenue")}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        chartMetric === "revenue"
                          ? "bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Revenue (ETB)
                    </button>
                  </div>
                </div>

                {/* Primary Recharts Chart */}
                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartMetric === "receipts" ? (
                      <BarChart
                        data={last7DaysReceiptsData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 11, fill: "#888888" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: "#888888" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: "bold",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                          }}
                          itemStyle={{ padding: "2px 0" }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                        />
                        <Bar
                          dataKey="approved"
                          name="Approved Receipts"
                          fill="#10b981"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="pending"
                          name="Pending Review"
                          fill="#f59e0b"
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="rejected"
                          name="Rejected Receipts"
                          fill="#ef4444"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    ) : (
                      <AreaChart
                        data={last7DaysReceiptsData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 11, fill: "#888888" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#888888" }}
                          axisLine={false}
                          tickLine={false}
                          unit=" ETB"
                        />
                        <Tooltip
                          formatter={(value: any) => [`${Number(value).toLocaleString()} ETB`, "Revenue"]}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#ffffff",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenueEtb"
                          name="Daily Revenue (ETB)"
                          stroke="#10b981"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SECONDARY CHARTS GRID: Payment Method Distribution & 7-Day Table */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Pie Chart: Payment Methods Distribution */}
                <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <PieChartIcon className="w-4 h-4 text-purple-500" />
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                      Receipts by Payment Method
                    </h4>
                  </div>

                  <div className="h-56 w-full my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Custom Legend Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                    {paymentMethodData.map((pm) => (
                      <div
                        key={pm.name}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: pm.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{pm.name}:</span>
                        <strong className="text-gray-900 dark:text-white">{pm.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table: 7-Day Daily Breakdown Details */}
                <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                        7-Day Receipts Summary
                      </h4>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Daily Stats
                    </span>
                  </div>

                  <div className="overflow-x-auto my-2">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-extrabold text-[10px] uppercase">
                          <th className="py-2 px-1">Day</th>
                          <th className="py-2 px-1 text-center">Total</th>
                          <th className="py-2 px-1 text-center text-emerald-500">Appr.</th>
                          <th className="py-2 px-1 text-center text-amber-500">Pend.</th>
                          <th className="py-2 px-1 text-right">Revenue (ETB)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300 font-medium">
                        {last7DaysReceiptsData.map((d) => (
                          <tr key={d.dateKey} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="py-1.5 px-1 font-bold text-gray-900 dark:text-white">
                              {d.day}
                            </td>
                            <td className="py-1.5 px-1 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[11px]">
                                {d.totalReceipts}
                              </span>
                            </td>
                            <td className="py-1.5 px-1 text-center font-bold text-emerald-600 dark:text-emerald-400">
                              {d.approved}
                            </td>
                            <td className="py-1.5 px-1 text-center font-bold text-amber-500">
                              {d.pending}
                            </td>
                            <td className="py-1.5 px-1 text-right font-extrabold text-gray-900 dark:text-white">
                              {d.revenueEtb.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-gray-400 pt-2 text-center border-t border-gray-100 dark:border-gray-800">
                    Real-time synchronized with MERN Express REST API
                  </p>
                </div>
              </div>

              {/* System Control Settings Toggles */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" /> Platform System Controls
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        Require Admin Receipt Review before Course Access
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        When enabled, students must upload CBE or Telebirr receipt screenshots.
                      </p>
                    </div>
                    <button
                      onClick={() => setRequireReceiptApproval(!requireReceiptApproval)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        requireReceiptApproval ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          requireReceiptApproval ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        Enable Automatic Downloadable Certificates
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        Instantly issue official PDF completion badges upon approval.
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoCertificateEnabled(!autoCertificateEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        autoCertificateEnabled ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                          autoCertificateEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Receipt Detail Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-4">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <FileText className="w-4 h-4" /> Receipt Verification
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {selectedReceipt.studentName}'s Payment
              </h3>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-2 text-xs">
                <p>
                  <strong>Course:</strong> {selectedReceipt.courseTitle}
                </p>
                <p>
                  <strong>Email:</strong> {selectedReceipt.studentEmail}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedReceipt.paymentMethod}
                </p>
                <p>
                  <strong>Transaction Ref:</strong>{" "}
                  <span className="font-mono text-emerald-600 font-bold">
                    {selectedReceipt.transactionRef}
                  </span>
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {selectedReceipt.amountEtb.toLocaleString()} ETB
                </p>
                <p>
                  <strong>Submitted Date:</strong> {selectedReceipt.submittedAt}
                </p>
              </div>

              {selectedReceipt.receiptImage && (
                <div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Receipt Photo Preview:
                  </p>
                  <img
                    src={selectedReceipt.receiptImage}
                    alt="Receipt Screenshot"
                    className="max-h-52 w-full object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-black/5"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                {selectedReceipt.status === "pending" && (
                  <button
                    onClick={() => {
                      onApproveReceipt(selectedReceipt.id);
                      setSelectedReceipt(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Unlock Access
                  </button>
                )}
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Payment Entry Modal */}
        {showManualPayModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateManualPayment}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-4"
            >
              <button
                type="button"
                onClick={() => setShowManualPayModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Manual Payment Record
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualStudentName}
                    onChange={(e) => setManualStudentName(e.target.value)}
                    placeholder="e.g. Yonas Tadesse"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={manualStudentEmail}
                    onChange={(e) => setManualStudentEmail(e.target.value)}
                    placeholder="yonas@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Target Course *
                  </label>
                  <select
                    value={manualCourseId}
                    onChange={(e) => setManualCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (${c.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                  >
                    <option value="Telebirr">Telebirr (0906521758)</option>
                    <option value="CBE Birr">CBE Birr (0906521758)</option>
                    <option value="CBE Bank Transfer">CBE Bank Transfer (1000425428016)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualPayModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Confirm & Grant Access
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
