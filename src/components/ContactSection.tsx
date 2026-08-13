import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  User,
  Headphones,
  Globe,
} from "lucide-react";

interface ContactSectionProps {
  onOpenAITutor?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenAITutor }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Course Enrollment & Payment",
    message: "",
  });

  const [selectedTopic, setSelectedTopic] = useState("Course Enrollment");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const topics = [
    "Course Enrollment",
    "Telebirr/CBE Payment Help",
    "1-on-1 Mentorship",
    "Technical Support",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          topic: selectedTopic,
          subject: formData.subject,
          message: formData.message,
        }),
      });
    } catch (err) {
      console.warn("Backend saved or offline mode:", err);
    }

    const targetEmail = "yaikobdiriba22@gmail.com";
    const mailSubject = encodeURIComponent(`[Yacob Tech Academy] ${selectedTopic} Inquiry from ${formData.name || "Student"}`);
    const mailBody = encodeURIComponent(
      `Hello Yacob Tech Academy Team,\n\n` +
      `I am submitting an inquiry via the website:\n\n` +
      `• Name: ${formData.name}\n` +
      `• Email: ${formData.email}\n` +
      `• Phone/Telegram: ${formData.phone || "Not provided"}\n` +
      `• Topic: ${selectedTopic}\n` +
      `• Location: ${formData.subject || "Addis Ababa"}\n\n` +
      `• Message:\n${formData.message}\n\n` +
      `Best regards,\n${formData.name}`
    );

    // Launch mailto direct email draft
    window.location.href = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gray-50/80 dark:bg-gray-900/50 border-t border-b border-gray-200/60 dark:border-gray-800/60 transition-colors relative overflow-hidden">
      {/* Background Glow Deco */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold text-xs">
            <Headphones className="w-4 h-4 text-emerald-500" />
            <span>24/7 Student Support & Contact</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Get in Touch with <span className="text-emerald-600 dark:text-emerald-400">Yacob Tech Academy</span> 📞
          </h2>
          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
            Have questions about course admissions, Telebirr/CBE bank transfer verifications, or career mentorship in Addis Ababa? Our dedicated support team is here to assist you.
          </p>
        </div>

        {/* Grid: Contact Info Cards & Interactive Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-xl space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  Academy Contact Information
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reach out directly via phone, email, or visit our Addis Ababa tech learning center.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Email Item */}
                <a
                  href="mailto:yaikobdiriba22@gmail.com"
                  className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-gray-900/60 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3.5 hover:border-emerald-500 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Direct Email Support
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white block mt-0.5">
                      yaikobdiriba22@gmail.com
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Response time: Within 2 hours
                    </span>
                  </div>
                </a>

                {/* Telegram Link Item */}
                <a
                  href="https://t.me/Yacob_Tech_Academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between gap-3.5 hover:border-sky-500 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                      <Send className="w-5 h-5 fill-white/20" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">
                        Telegram Group
                      </span>
                      <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                        t.me/Yacob_Tech_Academy
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </div>
                </a>

                {/* Phone Item */}
                <a
                  href="tel:0922067302"
                  className="p-4 rounded-2xl bg-teal-50/60 dark:bg-gray-900/60 border border-teal-200 dark:border-teal-900/50 flex items-start gap-3.5 hover:border-teal-500 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-600 dark:text-teal-400 block">
                      Academy Hotline & Telegram
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white block mt-0.5 font-mono">
                      0922067302 / 0906521758
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Mon - Sat (8:00 AM - 8:00 PM EAT)
                    </span>
                  </div>
                </a>

                {/* Address Item */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-gray-900/60 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 block">
                      Learning Campus Location
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white block mt-0.5">
                      Addis Ababa, Ethiopia 🇪🇹
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Bole Innovation Tech Hub, Ground Floor
                    </span>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700/60 flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-purple-600 dark:text-purple-400 block">
                      Office & Live Chat Hours
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white block mt-0.5">
                      Monday – Saturday: 8:00 AM – 8:00 PM
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Sunday: AI Automated Assistant Only
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Assistant Quick Callout */}
              {onOpenAITutor && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Need instant coding guidance?
                  </span>
                  <button
                    onClick={onOpenAITutor}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                  >
                    Ask AI Tutor
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Send Us a Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-xl space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white">
                    Send Us a Direct Message
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fill out the form below and Yaikob Diriba's student care team will get back to you immediately.
                </p>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                  Select Topic / Query Type:
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTopic(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        selectedTopic === t
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {submitted ? (
                /* Success Message */
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                      Direct Email Opened for yaikobdiriba22@gmail.com! ✉️
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                      Your default mail application has been opened with your pre-filled inquiry for topic <strong>"{selectedTopic}"</strong> addressed directly to <strong>yaikobdiriba22@gmail.com</strong>.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <a
                      href={`mailto:yaikobdiriba22@gmail.com?subject=${encodeURIComponent(`[Yacob Tech Academy] ${selectedTopic} Inquiry`)}&body=${encodeURIComponent(`• Name: ${formData.name}\n• Email: ${formData.email}\n• Phone: ${formData.phone}\n• Topic: ${selectedTopic}\n\nMessage:\n${formData.message}`)}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Re-open Email Client
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "Course Enrollment & Payment", message: "" });
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-extrabold text-xs transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Inputs */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yaikob Diriba"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. yaikobdiriba22@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Phone / Telegram Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0922067302"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Addis Ababa"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Your Message or Questions *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your questions regarding course modules, CBE/Telebirr payment receipts, or class schedules..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry to Yacob Tech Academy</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
