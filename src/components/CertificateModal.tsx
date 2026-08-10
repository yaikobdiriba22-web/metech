import React, { useState } from "react";
import { X, Award, CheckCircle2, Download, Share2, GraduationCap, ShieldCheck, Printer } from "lucide-react";
import { Course, User } from "../types";
import { UserBadges } from "./UserBadges";

interface CertificateModalProps {
  course: Course | null;
  user: User | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  user,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const studentName = user?.name || "Yaikob Diriba";
  const courseTitle = course?.title || "AI Engineer Masterclass: Building LLM Apps & Gemini Agents";
  const instructorName = course?.instructor.name || "Dr. Yacob Diriba";
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const certCode = `YTA-ETH-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleSimulatedDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl p-5 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-6 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-4 border-double border-emerald-500 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-center space-y-4 relative overflow-hidden print:border-4 print:p-8">
          {/* Background Ethiopian Watermark Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none text-[120px] font-black">
            🇪🇹
          </div>

          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left">
              <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest block leading-none">
                Yacob Tech Academy
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                ያዕቆብ ቴክ አካዳሚ • ADDIS ABABA, ETHIOPIA 🇪🇹
              </span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-4 py-1 rounded-full w-fit mx-auto border border-emerald-300 dark:border-emerald-800">
              Official Certificate of Completion & Skill Mastery
            </p>
          </div>

          <div className="py-2">
            <p className="text-xs text-gray-500 italic">This is proudly presented to</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1 underline decoration-emerald-500 decoration-2">
              {studentName}
            </h2>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            for successfully completing all practical modules, hands-on code exercises, and capstone requirements for
          </p>

          <p className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 px-4">
            "{courseTitle}"
          </p>

          {/* Verification Footer */}
          <div className="pt-6 grid grid-cols-2 gap-4 text-left border-t border-gray-200 dark:border-gray-800 text-xs">
            <div>
              <p className="text-gray-400 text-[10px]">Issued Date:</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{dateStr}</p>
              <p className="text-gray-400 text-[10px] mt-1">Verification Ref Code:</p>
              <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{certCode}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-[10px]">Lead Instructor & Founder:</p>
              <p className="font-bold text-gray-800 dark:text-gray-200">{instructorName}</p>
              <p className="text-emerald-600 text-[10px] font-semibold">Yacob Tech Academy Ethiopia</p>
            </div>
          </div>
        </div>

        {/* User Badges Section */}
        {user && (
          <UserBadges user={user} variant="full" />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verified Digital Badge • Authorized by Yacob Tech HQ
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>

            <button
              onClick={handleSimulatedDownload}
              disabled={downloading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Generating PDF..." : "Download PDF Certificate"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
