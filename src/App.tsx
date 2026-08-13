import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustedBy } from "./components/TrustedBy";
import { About } from "./components/About";
import { Categories } from "./components/Categories";
import { FeaturedCourses } from "./components/FeaturedCourses";
import { CourseDetailModal } from "./components/CourseDetailModal";
import { AILearningAssistant } from "./components/AILearningAssistant";
import { LearningJourney } from "./components/LearningJourney";
import { Marketplace } from "./components/Marketplace";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { Newsletter } from "./components/Newsletter";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { CertificateModal } from "./components/CertificateModal";
import { BlogModal } from "./components/BlogModal";
import { PaymentReceiptModal } from "./components/PaymentReceiptModal";
import { AdminDashboardModal } from "./components/AdminDashboardModal";
import { StudentDashboardModal } from "./components/StudentDashboardModal";
import { EmailToastNotification, EmailToast } from "./components/EmailToastNotification";
import { MernStackModal } from "./components/MernStackModal";
import { CustomerAssistantWidget } from "./components/CustomerAssistantWidget";
import { CareerRoadmapModal } from "./components/CareerRoadmapModal";
import { supabase } from "./lib/supabase";

import {
  CATEGORIES,
  COURSES,
  MARKETPLACE_ITEMS,
  TESTIMONIALS,
  PRICING_PLANS,
  FAQS,
} from "./data/initialData";
import { Course, User, PricingPlan, PaymentReceipt } from "./types";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("yacob_tech_active_user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error("Failed to parse saved user from localStorage", e);
    }
    return null; // Visitors start logged out by default so Login is visible
  });

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("yacob_tech_active_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("yacob_tech_active_user");
    }
  }, [user]);

  // Listen for Supabase real-time auth changes & restore active session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser((prev) => {
          if (prev) return prev;
          const userMeta = session.user.user_metadata || {};
          return {
            id: session.user.id,
            name: userMeta.full_name || session.user.email?.split("@")[0] || "Learner Student",
            email: session.user.email || "",
            avatar: userMeta.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            role: userMeta.role === "Admin" ? "Admin" : "Student",
            plan: userMeta.role === "Admin" ? "Enterprise" : "Pro",
            enrolledCourseIds: ["course-1", "course-2"],
            wishlistCourseIds: ["course-3"],
            completedCourseIds: ["course-1"],
            isEmailVerified: true,
            isApproved: true,
          };
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          name: userMeta.full_name || session.user.email?.split("@")[0] || "Learner Student",
          email: session.user.email || "",
          avatar: userMeta.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          role: userMeta.role === "Admin" ? "Admin" : "Student",
          plan: userMeta.role === "Admin" ? "Enterprise" : "Pro",
          enrolledCourseIds: ["course-1", "course-2"],
          wishlistCourseIds: ["course-3"],
          completedCourseIds: ["course-1"],
          isEmailVerified: true,
          isApproved: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>(["course-2"]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    "course-1",
  ]);

  // Payment receipts & admin approval state
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([
    {
      id: "rcpt-101",
      courseId: "course-2",
      courseTitle: "Full-Stack Web Development Bootcamp (React 19 & Express)",
      studentName: "Samuel Bekele",
      studentEmail: "samuel.bekele@gmail.com",
      studentPhone: "+251 911 482 910",
      amountUsd: 69,
      amountEtb: 8970,
      paymentMethod: "CBE",
      transactionRef: "CBE-984210385",
      receiptImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      submittedAt: "July 23, 2026, 11:30 AM",
      status: "pending",
      notes: "Transferred via CBE Birr App",
    },
  ]);

  const [showPaymentModalForCourse, setShowPaymentModalForCourse] = useState<Course | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showStudentDashboardModal, setShowStudentDashboardModal] = useState<boolean>(false);
  const [showMernModal, setShowMernModal] = useState<boolean>(false);
  const [showCareerRoadmapModal, setShowCareerRoadmapModal] = useState<boolean>(false);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authRoleRequested, setAuthRoleRequested] = useState<"Student" | "Admin">("Student");
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const handleOpenAdminPortal = () => {
    if (user?.role === "Admin") {
      setShowAdminModal(true);
    } else {
      setAuthRoleRequested("Admin");
      setShowAuthModal(true);
    }
  };

  const handleOpenStudentDashboard = () => {
    if (user) {
      setShowStudentDashboardModal(true);
    } else {
      setAuthRoleRequested("Student");
      setShowAuthModal(true);
    }
  };
  const [showBlogModal, setShowBlogModal] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [emailToasts, setEmailToasts] = useState<EmailToast[]>([]);

  // Fetch initial receipts from MERN Express API
  useEffect(() => {
    fetch("/api/receipts")
      .then((res) => res.json())
      .then((data) => {
        if (data.receipts && Array.isArray(data.receipts) && data.receipts.length > 0) {
          setReceipts(data.receipts);
        }
      })
      .catch((err) => console.log("MERN receipts sync:", err));
  }, []);

  // Toggle dark class on root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "blog") {
      setShowBlogModal(true);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleWishlist = (courseId: string) => {
    setWishlistIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getEnrollmentStatus = (courseId: string): "approved" | "pending_approval" | "not_enrolled" => {
    if (enrolledCourseIds.includes(courseId)) return "approved";
    const isPending = receipts.some((r) => r.courseId === courseId && r.status === "pending");
    if (isPending) return "pending_approval";
    return "not_enrolled";
  };

  const handleEnrollClick = (course: Course) => {
    const status = getEnrollmentStatus(course.id);
    if (status === "approved") {
      // Already enrolled, open details or resume
      setSelectedCourse(course);
    } else {
      // Fee payment required -> Open payment receipt modal
      setShowPaymentModalForCourse(course);
    }
  };

  const handleSubmitReceipt = (newReceipt: PaymentReceipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    // Unlock course so student can study immediately after finishing payment
    if (!enrolledCourseIds.includes(newReceipt.courseId)) {
      setEnrolledCourseIds((curr) => [...curr, newReceipt.courseId]);
    }
    fetch("/api/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReceipt),
    }).catch((err) => console.log("MERN POST receipt:", err));
  };

  const handleApproveReceipt = (receiptId: string) => {
    const target = receipts.find((r) => r.id === receiptId);
    if (target) {
      const toast: EmailToast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentName: target.studentName,
        studentEmail: target.studentEmail,
        courseTitle: target.courseTitle,
        status: "approved",
        transactionRef: target.transactionRef,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setEmailToasts((prev) => [toast, ...prev]);
    }

    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id === receiptId) {
          if (!enrolledCourseIds.includes(r.courseId)) {
            setEnrolledCourseIds((curr) => [...curr, r.courseId]);
          }
          return { ...r, status: "approved" as const };
        }
        return r;
      })
    );

    fetch(`/api/receipts/${receiptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    }).catch((err) => console.log("MERN PATCH receipt:", err));
  };

  const handleRejectReceipt = (receiptId: string) => {
    const target = receipts.find((r) => r.id === receiptId);
    if (target) {
      const toast: EmailToast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentName: target.studentName,
        studentEmail: target.studentEmail,
        courseTitle: target.courseTitle,
        status: "rejected",
        transactionRef: target.transactionRef,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setEmailToasts((prev) => [toast, ...prev]);
    }

    setReceipts((prev) =>
      prev.map((r) => (r.id === receiptId ? { ...r, status: "rejected" as const } : r))
    );

    fetch(`/api/receipts/${receiptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    }).catch((err) => console.log("MERN PATCH receipt:", err));
  };

  const handleDeleteReceipt = (receiptId: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
    fetch(`/api/receipts/${receiptId}`, {
      method: "DELETE",
    }).catch((err) => console.log("MERN DELETE receipt:", err));
  };

  const handleAddManualReceipt = (newReceipt: PaymentReceipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCoursesList((prev) => [newCourse, ...prev]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCoursesList((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCoursesList((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleGrantAccess = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
    }
  };

  const handleRevokeAccess = (courseId: string) => {
    setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setUser((prev) => (prev ? { ...prev, plan: plan.id as any } : null));
      alert(`Success! You have upgraded to the ${plan.name} plan.`);
    }
  };

  const pendingCount = receipts.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* 1. Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onOpenAuth={() => {
          setAuthRoleRequested("Student");
          setShowAuthModal(true);
        }}
        onLogout={() => setUser(null)}
        onOpenCertificates={() => setShowCertModal(true)}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenStudentDashboard={handleOpenStudentDashboard}
        onOpenMernModal={() => setShowMernModal(true)}
        onOpenCareerRoadmap={() => setShowCareerRoadmapModal(true)}
        pendingReceiptsCount={pendingCount}
        wishlistCount={wishlistIds.length}
        cartCount={enrolledCourseIds.length}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* 2. Hero Section */}
      <Hero
        onStartLearning={() => handleNavigate("courses")}
        onExploreCourses={() => handleNavigate("categories")}
        onOpenAITutor={() => handleNavigate("ai-tutor")}
        onOpenCareerRoadmap={() => setShowCareerRoadmapModal(true)}
      />

      {/* 3. Trusted By Companies */}
      <TrustedBy />

      {/* 4. About Section */}
      <About
        onOpenAITutor={() => handleNavigate("ai-tutor")}
        onExploreCourses={() => handleNavigate("courses")}
      />

      {/* 5. Categories Section */}
      <Categories
        categories={CATEGORIES}
        selectedCategory={selectedCategorySlug}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          handleNavigate("courses");
        }}
        courses={coursesList}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      {/* 6. Featured Courses Section */}
      <FeaturedCourses
        courses={coursesList}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategorySlug={setSelectedCategorySlug}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onSelectCourse={(c) => setSelectedCourse(c)}
        enrolledCourseIds={enrolledCourseIds}
        onEnroll={handleEnrollClick}
      />

      {/* 7. AI Learning Assistant Section */}
      <AILearningAssistant onOpenCareerRoadmap={() => setShowCareerRoadmapModal(true)} />

      {/* 8. Learning Journey Section */}
      <LearningJourney
        courses={coursesList}
        enrolledCourseIds={Array.from(new Set([...enrolledCourseIds, ...(user?.enrolledCourseIds || [])]))}
        completedCourseIds={user?.completedCourseIds || []}
        onSelectCourse={(c) => setSelectedCourse(c)}
        onToggleCompleteCourse={(courseId) => {
          if (!user) return;
          const currentCompleted = user.completedCourseIds || [];
          const isCompleted = currentCompleted.includes(courseId);
          const updated = isCompleted
            ? currentCompleted.filter((id) => id !== courseId)
            : [...currentCompleted, courseId];
          setUser({ ...user, completedCourseIds: updated });
        }}
      />

      {/* 9. Digital Marketplace Section */}
      <Marketplace items={MARKETPLACE_ITEMS} />

      {/* 10. Student Testimonials Section */}
      <Testimonials testimonials={TESTIMONIALS} />

      {/* 11. Pricing Section */}
      <Pricing plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />

      {/* 12. FAQ Section */}
      <FAQ faqs={FAQS} />

      {/* 13. Contact & Support Section */}
      <ContactSection onOpenAITutor={() => handleNavigate("ai-tutor")} />

      {/* 14. Newsletter Section */}
      <Newsletter />

      {/* 14. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          enrollmentStatus={getEnrollmentStatus(selectedCourse.id)}
          onEnrollClick={handleEnrollClick}
          onViewCertificate={() => {
            setSelectedCourse(null);
            setShowCertModal(true);
          }}
          completedCourseIds={user?.completedCourseIds || []}
          onToggleCompleteCourse={(courseId) => {
            if (!user) return;
            const isCompleted = user.completedCourseIds.includes(courseId);
            const updated = isCompleted
              ? user.completedCourseIds.filter((id) => id !== courseId)
              : [...user.completedCourseIds, courseId];
            setUser({ ...user, completedCourseIds: updated });
          }}
        />
      )}

      {showPaymentModalForCourse && (
        <PaymentReceiptModal
          course={showPaymentModalForCourse}
          user={user}
          onClose={() => setShowPaymentModalForCourse(null)}
          onSubmitReceipt={handleSubmitReceipt}
        />
      )}

      {showStudentDashboardModal && user && (
        <StudentDashboardModal
          user={user}
          courses={coursesList}
          receipts={receipts}
          onClose={() => setShowStudentDashboardModal(false)}
          onOpenCourse={(c) => setSelectedCourse(c)}
          onOpenCertificates={() => setShowCertModal(true)}
          onOpenPaymentModal={() => setShowPaymentModalForCourse(coursesList[0])}
          onToggleCompleteCourse={(courseId) => {
            const isCompleted = user.completedCourseIds?.includes(courseId);
            const updated = isCompleted
              ? user.completedCourseIds.filter((id) => id !== courseId)
              : [...(user.completedCourseIds || []), courseId];
            setUser({ ...user, completedCourseIds: updated });
          }}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showAdminModal && (
        <AdminDashboardModal
          receipts={receipts}
          courses={coursesList}
          enrolledCourseIds={enrolledCourseIds}
          currentUser={user}
          onApproveReceipt={handleApproveReceipt}
          onRejectReceipt={handleRejectReceipt}
          onDeleteReceipt={handleDeleteReceipt}
          onAddManualReceipt={handleAddManualReceipt}
          onAddCourse={handleAddCourse}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
          onGrantAccess={handleGrantAccess}
          onRevokeAccess={handleRevokeAccess}
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          initialRole={authRoleRequested}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => setUser(u)}
        />
      )}

      {showCertModal && (
        <CertificateModal
          course={COURSES[0]}
          user={user}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {showBlogModal && <BlogModal onClose={() => setShowBlogModal(false)} />}

      {showMernModal && <MernStackModal onClose={() => setShowMernModal(false)} />}

      <CareerRoadmapModal
        isOpen={showCareerRoadmapModal}
        onClose={() => setShowCareerRoadmapModal(false)}
        courses={coursesList}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      {/* Simulated Email Toast Notification Service */}
      <EmailToastNotification
        toasts={emailToasts}
        onDismiss={(id) => setEmailToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      {/* Floating Customer Support AI Assistant */}
      <CustomerAssistantWidget />
    </div>
  );
};
