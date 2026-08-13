import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Trophy,
  X,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning" | "achievement";

export interface ToastOptions {
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration: number;
  actionLabel?: string;
  onAction?: () => void;
  createdAt: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message: string, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (title: string, message: string, options?: ToastOptions) => void;
    error: (title: string, message: string, options?: ToastOptions) => void;
    info: (title: string, message: string, options?: ToastOptions) => void;
    warning: (title: string, message: string, options?: ToastOptions) => void;
    achievement: (title: string, message: string, options?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message: string, options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const duration = options?.duration ?? 5000;

      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        duration,
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
        createdAt: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts
    },
    []
  );

  const toast = {
    success: (title: string, message: string, options?: ToastOptions) =>
      addToast("success", title, message, options),
    error: (title: string, message: string, options?: ToastOptions) =>
      addToast("error", title, message, options),
    info: (title: string, message: string, options?: ToastOptions) =>
      addToast("info", title, message, options),
    warning: (title: string, message: string, options?: ToastOptions) =>
      addToast("warning", title, message, options),
    achievement: (title: string, message: string, options?: ToastOptions) =>
      addToast("achievement", title, message, options),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: ToastMessage[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 sm:right-6 z-[100] flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Individual Toast Item Component
const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const [progress, setProgress] = useState(100);

  React.useEffect(() => {
    if (toast.duration <= 0) return;

    const intervalTime = 50;
    const step = (intervalTime / toast.duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onRemove(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onRemove]);

  const renderIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case "achievement":
        return (
          <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 shrink-0 relative">
            <Trophy className="w-5 h-5 animate-bounce" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1" />
          </div>
        );
      case "error":
        return (
          <div className="p-2 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        );
      case "warning":
        return (
          <div className="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  const getBorderAndBg = () => {
    switch (toast.type) {
      case "success":
        return "border-emerald-500/30 dark:border-emerald-500/20 bg-white/95 dark:bg-gray-900/95 shadow-emerald-500/10";
      case "achievement":
        return "border-amber-500/40 dark:border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-white/95 to-amber-500/5 dark:via-gray-900/95 shadow-amber-500/20";
      case "error":
        return "border-rose-500/30 dark:border-rose-500/20 bg-white/95 dark:bg-gray-900/95 shadow-rose-500/10";
      case "warning":
        return "border-amber-500/30 dark:border-amber-500/20 bg-white/95 dark:bg-gray-900/95 shadow-amber-500/10";
      case "info":
      default:
        return "border-indigo-500/30 dark:border-indigo-500/20 bg-white/95 dark:bg-gray-900/95 shadow-indigo-500/10";
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-emerald-500";
      case "achievement":
        return "bg-amber-400";
      case "error":
        return "bg-rose-500";
      case "warning":
        return "bg-amber-500";
      case "info":
      default:
        return "bg-indigo-500";
    }
  };

  return (
    <div
      className={`pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 relative overflow-hidden flex flex-col gap-2 ${getBorderAndBg()}`}
    >
      <div className="flex items-start gap-3">
        {renderIcon()}

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            {toast.type === "achievement" && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Milestone Unlocked 🏆
              </span>
            )}
            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
              {toast.title}
            </h4>
          </div>

          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
            {toast.message}
          </p>

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                onRemove(toast.id);
              }}
              className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 group transition-colors"
            >
              <span>{toast.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg transition-colors absolute top-3 right-3"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      {toast.duration > 0 && (
        <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-75 ease-linear ${getProgressBarColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
