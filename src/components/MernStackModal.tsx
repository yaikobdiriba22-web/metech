import React, { useEffect, useState } from "react";
import { Database, Server, Code, Cpu, X, CheckCircle2, Layers, Activity, RefreshCw } from "lucide-react";

interface MernStackModalProps {
  onClose: () => void;
}

interface MernStatus {
  architecture: string;
  database: {
    type: string;
    status: string;
    databaseName: string;
    collections: string[];
  };
  backend: {
    framework: string;
    environment: string;
    port: number;
  };
  frontend: {
    library: string;
  };
}

export const MernStackModal: React.FC<MernStackModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<MernStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mern/status");
      if (!res.ok) throw new Error("Failed to reach MERN status API");
      const data = await res.json();
      setStatus(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load MERN status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                MERN Full-Stack Architecture
              </h2>
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Yacob Tech Academy is built on the complete MERN Full-Stack (MongoDB, Express, React, Node.js)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">Connecting to MERN Express Backend & MongoDB...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grid of 4 MERN components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* M: MongoDB */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1">
                  <Database className="w-4 h-4" />
                  <span>M - MongoDB (Mongoose)</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {status?.database.type}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {status?.database.status}
                  </span>
                </div>
              </div>

              {/* E: Express.js */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm mb-1">
                  <Server className="w-4 h-4" />
                  <span>E - Express.js API</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {status?.backend.framework} REST Endpoints
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Port:</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    :{status?.backend.port}
                  </span>
                </div>
              </div>

              {/* R: React 19 */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60">
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-sm mb-1">
                  <Code className="w-4 h-4" />
                  <span>R - React 19 Client</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {status?.frontend.library}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Build System:</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">Vite 6</span>
                </div>
              </div>

              {/* N: Node.js */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>N - Node.js Server</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {status?.backend.environment}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Async I/O:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Enabled</span>
                </div>
              </div>
            </div>

            {/* Active MongoDB Collections */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active MongoDB Collections
                </span>
                <span className="font-mono text-[11px] text-gray-400">{status?.database.databaseName}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {status?.database.collections.map((col) => (
                  <span
                    key={col}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm"
                  >
                    📁 db.{col}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span>Yacob Tech Academy MERN Engine</span>
          <button
            onClick={fetchStatus}
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
          >
            <RefreshCw className="w-3 h-3" /> Refresh Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
