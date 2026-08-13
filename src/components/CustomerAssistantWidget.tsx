import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  CreditCard,
  ShieldCheck,
  BookOpen,
  Loader2,
  Minimize2,
} from "lucide-react";

interface Message {
  sender: "user" | "assistant";
  text: string;
  time: string;
}

export const CustomerAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Selam! 🇪🇹 I am your Yacob Tech Academy Customer Support AI Assistant. How can I help you today with course registrations, admin approvals, CBE/Telebirr payment receipts, or course tracks?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "Selam! I'm here to help. You can also reach our admin team at 0906521758 or via Telegram @yacobtech.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I encountered an issue connecting to the AI backend. Please check your internet connection or reach us directly at 0906521758 / Telebirr account 0906521758.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    { label: "💳 Telebirr & CBE Payment Info", prompt: "How do I make a course fee payment using Telebirr or CBE Bank?" },
    { label: "🛡️ Admin Approval Process", prompt: "How long does student registration approval take by the admin?" },
    { label: "🎓 Available Courses & Tracks", prompt: "What course tracks are available at Yacob Tech Academy?" },
    { label: "📜 Certificate Verification", prompt: "How do I get my official certificate after finishing a course?" },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] bg-white dark:bg-gray-900 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Customer Assistant AI <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-emerald-100/80">Yacob Tech Academy 24/7 Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50 dark:bg-gray-950/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-gray-700/80 rounded-tl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      msg.sender === "user" ? "text-emerald-100/70" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-2xl w-fit border border-emerald-500/20">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                <span>AI Assistant is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 border-t border-gray-200/60 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip.prompt)}
                disabled={loading}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-gray-700 whitespace-nowrap shrink-0 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Assistant anything about Yacob Tech..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-600/20 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 border border-emerald-400/40"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-emerald-200/20" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
        </div>
        <span>{isOpen ? "Close Assistant" : "Customer Assistant AI"}</span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </button>
    </div>
  );
};
