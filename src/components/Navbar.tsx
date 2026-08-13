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
  Flame,
  Phone,
  Send,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  onOpenCareerRoadmap?: () => void;
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
  onOpenCareerRoadmap,
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
          <div className="relative group-hover:scale-105 transition-transform">
            <img
              src="/src/assets/images/yacob_tech_logo_1786612504492.jpg"
              alt="Yacob Tech Academy Logo"
              className="w-10 h-10 rounded-2xl object-cover shadow-md shadow-emerald-500/20 border border-emerald-500/40"
              referrerPolicy="no-referrer"
            />
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
          {/* Dashboards - ONLY VISIBLE WHEN USER IS LOGGED IN */}
          {user && (
            <>
              {/* Student Dashboard Button */}
              {onOpenStudentDashboard && (
                <button
                  onClick={onOpenStudentDashboard}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Open Student Learning Dashboard"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  <span className="hidden md:inline">Student Dashboard 🎓</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-black text-[10px] flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{user.dailyStreak || 3}d</span>
                  </span>
                </button>
              )}

              {/* Admin Dashboard Button (Prominent for Admin users) */}
              <button
                onClick={onOpenAdmin}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors relative ${
                  user.role === "Admin"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300 shadow-sm"
                    : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300"
                }`}
                title="Admin Payment Approvals & Dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline">
                  {user.role === "Admin" ? "Admin Dashboard 🛡️" : "Admin Portal"}
                </span>
                {pendingReceiptsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                    {pendingReceiptsCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Contact Button */}
          <button
            onClick={() => handleNavClick("contact")}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-teal-700 dark:text-teal-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            title="Contact Yacob Tech Academy Support"
          >
            <Phone className="w-3.5 h-3.5 text-teal-500" />
            <span className="hidden xl:inline">Contact 📞</span>
          </button>

          {/* Career Roadmap AI Button */}
          {onOpenCareerRoadmap && (
            <button
              onClick={onOpenCareerRoadmap}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
              title="Generate Personalized AI Career Roadmap"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AI Roadmap</span>
            </button>
          )}

          {/* Telegram Group Direct Icon Link */}
          <a
            href="https://t.me/Yacob_Tech_Academy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 transition-all shadow-xs flex items-center justify-center hover:scale-105"
            title="Telegram Group (t.me/Yacob_Tech_Academy)"
            aria-label="Telegram Group"
          >
            <Send className="w-4 h-4 text-sky-500 fill-sky-500/20" />
          </a>

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

          {/* Smooth Animated Dark Mode Toggle Switch */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-15 h-8 rounded-full p-1 border transition-colors duration-300 ease-in-out cursor-pointer flex items-center justify-between shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
              darkMode
                ? "bg-gray-900 border-emerald-500/40 shadow-emerald-950/60"
                : "bg-amber-100/90 border-amber-300 shadow-amber-200/60"
            }`}
            title={darkMode ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
            aria-label="Toggle Theme"
          >
            {/* Ambient Background Icons inside Track */}
            <Sun className={`w-3.5 h-3.5 text-amber-500 transition-opacity duration-200 ml-0.5 ${darkMode ? "opacity-30" : "opacity-90"}`} />
            <Moon className={`w-3.5 h-3.5 text-emerald-400 transition-opacity duration-200 mr-0.5 ${darkMode ? "opacity-90" : "opacity-30"}`} />

            {/* Animated Sliding Knob */}
            <motion.div
              className={`absolute top-0.5 left-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-md border transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-950 text-emerald-400 border-gray-700 shadow-black/50"
                  : "bg-white text-amber-500 border-amber-200 shadow-amber-500/20"
              }`}
              animate={{
                x: darkMode ? 28 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <motion.div
                key={darkMode ? "dark" : "light"}
                initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <Moon className="w-4 h-4 fill-emerald-400/20 text-emerald-400" />
                ) : (
                  <Sun className="w-4 h-4 fill-amber-400/30 text-amber-500" />
                )}
              </motion.div>
            </motion.div>
          </motion.button>

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

                  {/* Student Dashboard option */}
                  {onOpenStudentDashboard && (
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
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs transition-all shadow-xs"
              >
                Sign In / Login 🔑
              </button>
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all"
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
            {user && (
              <>
                {onOpenStudentDashboard && (
                  <button
                    onClick={() => {
                      onOpenStudentDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300/50 dark:border-emerald-800/50"
                  >
                    <span>Student Dashboard 🎓</span>
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                  </button>
                )}
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-800/40"
                >
                  <span>{user.role === "Admin" ? "Admin Dashboard 🛡️" : "Admin Approvals Portal"}</span>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                </button>
              </>
            )}

            {/* Telegram Link in Mobile Menu */}
            <a
              href="https://t.me/Yacob_Tech_Academy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30 border border-sky-300/40 dark:border-sky-800/40"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" /> Telegram Group
              </span>
              <ChevronRight className="w-4 h-4 text-sky-400" />
            </a>

            {/* Mobile Theme Toggle Switch */}
            <div className="flex items-center justify-between px-4 py-2.5 my-1 rounded-xl bg-gray-100/70 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                Theme: {darkMode ? "Dark Mode 🌙" : "Light Mode ☀️"}
              </span>
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                whileTap={{ scale: 0.92 }}
                className={`relative w-14 h-7 rounded-full p-0.5 border transition-colors duration-300 flex items-center cursor-pointer ${
                  darkMode ? "bg-gray-950 border-emerald-500/50" : "bg-amber-100 border-amber-300"
                }`}
              >
                <motion.div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs ${
                    darkMode ? "bg-gray-900 text-emerald-400" : "bg-white text-amber-500"
                  }`}
                  animate={{ x: darkMode ? 26 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </motion.div>
              </motion.button>
            </div>
          </nav>
          {user ? (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs text-center border border-red-200 dark:border-red-900/50 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out ({user.name})
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs text-center shadow-md shadow-emerald-600/20"
              >
                Sign In / Login 🔑
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
