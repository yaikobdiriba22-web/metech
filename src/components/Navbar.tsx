import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Search,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  LogOut,
  Award,
  ShieldCheck,
} from "lucide-react";
import { User } from "../types";
import { UserBadges } from "./UserBadges";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCertificates: () => void;
  onOpenAdmin: () => void;
  onOpenStudentDashboard?: () => void;
  onOpenMernModal?: () => void;
  pendingReceiptsCount: number;
  wishlistCount: number;
  cartCount: number;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  user,
  onOpenAuth,
  onLogout,
  onOpenCertificates,
  onOpenAdmin,
  onOpenStudentDashboard,
  onOpenMernModal,
  pendingReceiptsCount,
  wishlistCount,
  cartCount,
  onNavigate,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Courses", id: "courses" },
    { label: "Categories", id: "categories" },
    { label: "AI Learning", id: "ai-tutor" },
    { label: "Marketplace", id: "marketplace" },
    { label: "Pricing", id: "pricing" },
    { label: "Blog", id: "blog" },
    { label: "Contact", id: "contact" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? darkMode
            ? "bg-gray-950/85 backdrop-blur-md border-b border-gray-800/80 shadow-lg shadow-black/20 py-3"
            : "bg-white/85 backdrop-blur-md border-b border-emerald-100/80 shadow-sm py-3"
          : darkMode
          ? "bg-transparent py-5 border-b border-gray-800/30"
          : "bg-transparent py-5 border-b border-gray-200/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo with Ethiopian Brand Badge */}
        <button
          onClick={() => handleNavClick("hero")}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform relative">
            <GraduationCap className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 text-xs">🇪🇹</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              Yacob <span className="text-emerald-600 dark:text-emerald-400">Tech</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Academy Ethiopia 🇪🇹
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-gray-100/60 dark:bg-gray-900/60 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
              }`}
            >
              {item.label}
              {item.id === "ai-tutor" && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 font-bold rounded-full">
                  AI
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MERN Stack Button */}
          {onOpenMernModal && (
            <button
              onClick={onOpenMernModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
              title="View MERN Stack Fullstack Architecture"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MERN Fullstack</span>
            </button>
          )}

          {/* Role-Specific Dashboard Buttons */}
          {user?.role === "Student" && onOpenStudentDashboard && (
            <button
              onClick={onOpenStudentDashboard}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Open Student Learning Dashboard"
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">Student Dashboard 🎓</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors relative ${
              user?.role === "Admin"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300 shadow-sm"
                : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300"
            }`}
            title="Admin Payment Approvals & Dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">
              {user?.role === "Admin" ? "Admin Dashboard 🛡️" : "Admin Portal"}
            </span>
            {pendingReceiptsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                {pendingReceiptsCount}
              </span>
            )}
          </button>

          {/* Wishlist Indicator */}
          <button
            onClick={() => handleNavClick("courses")}
            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>

          {/* User Auth or Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/50 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden md:inline text-xs font-semibold text-gray-800 dark:text-gray-100 pr-2">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-2.5 z-50 space-y-2">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full tracking-wider ${
                          user.role === "Admin"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        }`}
                      >
                        {user.role === "Admin" ? "🛡️ Admin" : "🎓 Student"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Work Permission: {user.role === "Admin" ? "Full Administrator Access" : "Course Study & Telebirr/CBE Payments"}
                    </p>
                  </div>

                  {/* User Badges Component */}
                  <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <UserBadges user={user} variant="compact" />
                  </div>

                  {/* Student Dashboard option for Student Role */}
                  {user.role === "Student" && onOpenStudentDashboard && (
                    <button
                      onClick={() => {
                        onOpenStudentDashboard();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      Student Dashboard 🎓
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenCertificates();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <Award className="w-4 h-4 text-emerald-500" />
                    My Certificates & Badges
                  </button>

                  <button
                    onClick={() => {
                      onOpenAdmin();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    {user.role === "Admin" ? "Admin Control Dashboard 🛡️" : "Admin Approvals Login"}
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Login
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 shadow-xl">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeSection === item.id
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
            >
              <span>Admin Approvals Portal</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </button>
          </nav>
          {!user && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold text-sm text-center shadow-md shadow-emerald-600/20"
              >
                Login / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
