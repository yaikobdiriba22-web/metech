import React from "react";
import { X, Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";

interface BlogModalProps {
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ onClose }) => {
  const articles = [
    {
      id: "1",
      title: "How Gemini 3.6 Flash is Revolutionizing Online Tech Education",
      readTime: "5 min read",
      date: "July 20, 2026",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      summary: "Explore how real-time LLM feedback, intelligent code review, and automated quiz generation accelerate student learning by 3x.",
    },
    {
      id: "2",
      title: "The 2026 Roadmap to Becoming a Full-Stack AI Engineer",
      readTime: "8 min read",
      date: "July 15, 2026",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
      summary: "From TypeScript and React 19 to RAG architecture, vector search, and deploying autonomous agents on Cloud Run.",
    },
    {
      id: "3",
      title: "Mastering Figma Design Systems with Auto-Layout 5.0",
      readTime: "6 min read",
      date: "July 10, 2026",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
      summary: "Learn how senior product designers structure variables, glassmorphic themes, and component variants for enterprise apps.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academy Insights</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Yacob Tech Academy Blog & Articles
          </h2>
          <p className="text-xs text-gray-500">
            Latest news, engineering tutorials, design guides, and career roadmaps.
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-center"
            >
              <img
                src={art.image}
                alt={art.title}
                className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span>{art.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    {art.readTime}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white hover:text-emerald-600 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{art.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
