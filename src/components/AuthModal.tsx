import React, { useState } from "react";
import { X, GraduationCap, Mail, Lock, User as UserIcon, Sparkles, ShieldCheck, UserCheck, Home } from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: "Student" | "Admin";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  initialRole = "Student",
}) => {
  const [selectedRole, setSelectedRole] = useState<"Student" | "Admin">(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(
    initialRole === "Admin" ? "admin@yacobtech.com" : "student@yacobtech.com"
  );
  const [name, setName] = useState(
    initialRole === "Admin" ? "Yacob Tech Admin" : "Yaikob Diriba"
  );
  const [password, setPassword] = useState("••••••••");

  const handleRoleChange = (role: "Student" | "Admin") => {
    setSelectedRole(role);
    if (role === "Admin") {
      setEmail("admin@yacobtech.com");
      setName("Yacob Tech Admin");
    } else {
      setEmail("student@yacobtech.com");
      setName("Yaikob Diriba");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      name: name || (selectedRole === "Admin" ? "System Admin" : "Learner Student"),
      email: email || (selectedRole === "Admin" ? "admin@yacobtech.com" : "student@yacobtech.com"),
      avatar:
        selectedRole === "Admin"
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: selectedRole === "Admin" ? "Admin" : "Student",
      plan: selectedRole === "Admin" ? "Enterprise" : "Pro",
      enrolledCourseIds: ["course-1", "course-2"],
      wishlistCourseIds: ["course-3"],
      completedCourseIds: ["course-1"],
    };
    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickLoginStudent = () => {
    const studentUser: User = {
      name: "Yaikob Diriba",
      email: "yaikobdiriba22@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Student",
      plan: "Pro",
      enrolledCourseIds: ["course-1", "course-2"],
      wishlistCourseIds: ["course-3"],
      completedCourseIds: ["course-1"],
    };
    onLoginSuccess(studentUser);
    onClose();
  };

  const handleQuickLoginAdmin = () => {
    const adminUser: User = {
      name: "Yacob Tech Administrator",
      email: "admin@yacobtech.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "Admin",
      plan: "Enterprise",
      enrolledCourseIds: ["course-1", "course-2", "course-3"],
      wishlistCourseIds: [],
      completedCourseIds: ["course-1", "course-2"],
    };
    onLoginSuccess(adminUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-5">
        {/* Top Header Navigation Controls */}
        <div className="flex items-center justify-between absolute top-4 left-4 right-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-emerald-500" />
            <span>Go to Home</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 pt-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {isSignUp ? "Create Account" : "Login to Academy Portal"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select your account role to access your assigned work permissions
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="text-[11px] uppercase font-extrabold tracking-wider text-gray-400 block mb-1.5">
            Select Account Role:
          </label>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleChange("Student")}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === "Student"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4" /> Student Role
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("Admin")}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === "Admin"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Role
            </button>
          </div>
        </div>

        {/* Permission Callout Banner */}
        <div
          className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
            selectedRole === "Admin"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
          }`}
        >
          <p className="font-extrabold flex items-center gap-1.5">
            {selectedRole === "Admin" ? (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Work Permissions:
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-emerald-600" /> Student Work Permissions:
              </>
            )}
          </p>
          <p className="text-[11px] opacity-90 leading-relaxed">
            {selectedRole === "Admin"
              ? "Full access to Admin Approvals Portal, Receipt Verifications, Recharts Analytics, and MERN Express API database."
              : "Access enrolled courses, study after fee payment (Telebirr/CBE Birr 0906521758 or CBE Bank 1000425428016), ask AI mentor & generate certificates."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={selectedRole === "Admin" ? "Admin Name" : "Student Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder={selectedRole === "Admin" ? "admin@yacobtech.com" : "student@yacobtech.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
              selectedRole === "Admin"
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            {isSignUp ? `Register as ${selectedRole}` : `Login as ${selectedRole}`}
          </button>
        </form>

        {/* One-Click Quick Demo Role Logins */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-[10px] uppercase font-black text-center text-gray-400">
            Instant Demo Logins:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickLoginStudent}
              className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Student Demo
            </button>
            <button
              onClick={handleQuickLoginAdmin}
              className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Admin Demo
            </button>
          </div>
        </div>

        {/* Toggle Sign up / Login & Go to Home Link */}
        <div className="text-center text-xs text-gray-500 space-y-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <div>
            {isSignUp ? "Already registered?" : "Need a new account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-600 font-bold underline hover:text-emerald-500"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </div>
          <div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 font-extrabold hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors text-xs"
            >
              <Home className="w-3.5 h-3.5 text-emerald-500" />
              <span>← Go to Home Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

