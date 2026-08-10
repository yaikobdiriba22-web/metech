import React, { useEffect } from "react";
import { Mail, CheckCircle2, XCircle, Send, X, Sparkles, ExternalLink } from "lucide-react";

export interface EmailToast {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  status: "approved" | "rejected";
  transactionRef: string;
  timestamp: string;
}

interface EmailToastNotificationProps {
  toasts: EmailToast[];
  onDismiss: (id: string) => void;
}

export const EmailToastNotification: React.FC<EmailToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: EmailToast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 7000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isApproved = toast.status === "approved";

  return (
    <div className="pointer-events-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 relative overflow-hidden animate-in slide-in-from-bottom-5 duration-300 transform hover:scale-[1.01] transition-transform">
      {/* Top indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isApproved
            ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"
            : "bg-gradient-to-r from-red-500 via-amber-500 to-red-600"
        }`}
      />

      <div className="flex items-start gap-3 pt-1">
        {/* Email Icon Badge */}
        <div
          className={`p-2.5 rounded-2xl shrink-0 ${
            isApproved
              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30"
              : "bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 ring-1 ring-red-500/30"
          }`}
        >
          <Mail className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1 space-y-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Send className="w-3 h-3" />
              <span>Simulated Email Notification Dispatched</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Email Recipient Info */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span>To:</span>
            <strong className="text-gray-900 dark:text-white font-bold">{toast.studentName}</strong>
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
              {toast.studentEmail}
            </span>
          </div>

          {/* Email Subject Line */}
          <div
            className={`p-2.5 rounded-xl text-xs font-semibold mt-1 border ${
              isApproved
                ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                : "bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-800/80 text-red-900 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              {isApproved ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span>
                Subject: Payment {isApproved ? "Approved & Course Unlocked! 🎉" : "Receipt Rejected ⚠️"}
              </span>
            </div>
            <p className="text-[11px] font-normal leading-relaxed opacity-90 pl-5">
              {isApproved
                ? `Hi ${toast.studentName.split(" ")[0]}, your receipt (${toast.transactionRef}) was verified. You now have full lifetime access to "${toast.courseTitle}".`
                : `Hi ${toast.studentName.split(" ")[0]}, your receipt (${toast.transactionRef}) for "${toast.courseTitle}" could not be verified. Please re-upload a clear screenshot.`}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
            <span className="font-mono">SMTP Server: smtp.yacobtech.edu.et</span>
            <span>{toast.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
