import React from "react";
import { GraduationCap, Github, Twitter, Linkedin, Youtube, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-900">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Yacob <span className="text-emerald-400">Tech</span> Academy
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Tagline: <span className="text-emerald-400 font-semibold">Learn Today, Build Tomorrow.</span>
              <br />
              Empowering global talent with AI-assisted learning, expert-led courses, hands-on portfolio projects, and verified career mentorship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 hover:bg-emerald-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 hover:bg-emerald-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 hover:bg-emerald-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-900 hover:bg-emerald-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">Company</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("hero")} className="hover:text-white transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("testimonials")} className="hover:text-white transition-colors">
                  Student Stories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-white transition-colors">
                  Press & Media
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Courses */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">Courses</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                  Full Stack Web Dev
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                  UI/UX Figma Design
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                  Cyber Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("courses")} className="hover:text-white transition-colors">
                  Cloud Architect
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">Resources</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate("ai-tutor")} className="hover:text-white transition-colors">
                  24/7 AI Tutor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("marketplace")} className="hover:text-white transition-colors">
                  Digital Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("pricing")} className="hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("faq")} className="hover:text-white transition-colors">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Yacob Tech Academy Ethiopia. Built on MERN Fullstack Architecture (MongoDB, Express, React 19, Node.js).</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-300">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
