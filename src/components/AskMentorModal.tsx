import React, { useState } from "react";
import { X, Send, MessageSquare, Bot, Check, Sparkles, User, ShieldCheck } from "lucide-react";
import { Course, MentorChatMessage } from "../types";

interface AskMentorModalProps {
  course: Course;
  onClose: () => void;
}

export const AskMentorModal: React.FC<AskMentorModalProps> = ({ course, onClose }) => {
  const instructor = course.instructor;
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    {
      id: "msg-1",
      sender: "mentor",
      senderName: instructor.name,
      text: `Selam! 🇪🇹 I am ${instructor.name}, lead mentor for "${course.title}". Feel free to ask me any question about the curriculum, coding exercises, or payment options!`,
      timestamp: "Just now",
      courseId: course.id,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "How does Module 1 compare to real industry projects?",
    "Can I pay via CBE or Telebirr?",
    "What are the job opportunities in Ethiopia after finishing?",
    "Could you clarify the prerequisite requirements?",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: MentorChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      senderName: "You",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      courseId: course.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Thanks for reaching out about ${course.title}! `;
      const lower = query.toLowerCase();

      if (lower.includes("cbe") || lower.includes("telebirr") || lower.includes("pay")) {
        replyText += `You can easily pay via Commercial Bank of Ethiopia (CBE account: 1000123456789) or Telebirr (0911234567). Just upload your payment screenshot or transaction ID, and our admin team approves it within minutes!`;
      } else if (lower.includes("job") || lower.includes("career") || lower.includes("ethiopia")) {
        replyText += `Graduates of Yacob Tech Academy receive direct referrals to top tech hubs in Addis Ababa, remote international software contracts, and access to our 3,000+ alumni network!`;
      } else if (lower.includes("module") || lower.includes("project") || lower.includes("code")) {
        replyText += `Module 1 covers hands-on full-stack development with modern industry practices. We provide starter GitHub repositories and step-by-step guidance.`;
      } else {
        replyText += `That's a great question! I've logged your query for "${course.title}". I'm actively reviewing your student notes and will provide personalized feedback shortly.`;
      }

      const mentorReply: MentorChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "mentor",
        senderName: instructor.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        courseId: course.id,
      };

      setMessages((prev) => [...prev, mentorReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-[620px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/50"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-emerald-900 rounded-full flex items-center justify-center text-[8px]">
                🇪🇹
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">{instructor.name}</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-[11px] text-emerald-100 font-medium line-clamp-1">{instructor.title}</p>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-emerald-200">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Online Mentor • Responds quickly</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-emerald-900 dark:text-emerald-200 shrink-0">
          <span className="truncate font-semibold">Course: {course.title}</span>
          <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
            Live Query
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50/50 dark:bg-gray-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === "student" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "mentor" ? (
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-emerald-500 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  You
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                  msg.sender === "student"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/60 rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75 font-semibold">
                  <span>{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs italic">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-6 h-6 rounded-lg object-cover"
              />
              <span className="animate-pulse">{instructor.name} is typing a response...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-gray-100/80 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:text-emerald-700 border border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors text-[10px] font-medium shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
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
              placeholder={`Ask ${instructor.name} about this course...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
