export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  company: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  bio?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessonsCount: number;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isPreview?: boolean;
  }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryId: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isFree?: boolean;
  rating: number;
  reviewsCount: number;
  duration: string;
  lessonsCount: number;
  studentsEnrolled: number;
  instructor: Instructor;
  image: string;
  description: string;
  learnings: string[];
  requirements: string[];
  modules: CourseModule[];
  tags: string[];
  lastUpdated: string;
  certificateProvided: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  coursesCount: number;
  bgGradient: string;
  accentColor: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: "E-books" | "Source Codes" | "Templates" | "AI Prompts" | "Design Assets" | "Video Courses";
  price: number;
  rating: number;
  salesCount: number;
  author: string;
  image: string;
  description: string;
  fileFormat: string;
  features: string[];
  demoUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country: string;
  countryFlag: string;
  avatar: string;
  rating: number;
  review: string;
  courseTaken: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  popular?: boolean;
  features: {
    text: string;
    included: boolean;
  }[];
  ctaText: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "AI Tutor" | "Certificates" | "Payments" | "Marketplace";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
}

export interface CodeReviewResult {
  score: number;
  summary: string;
  keyStrengths: string[];
  areaForImprovement: string[];
  optimizedCode: string;
  explanationOfFixes: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  estimatedHours: string;
  keyTechnologies: string[];
  keyDeliverables: string[];
  careerImpact: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: "Free" | "Pro" | "Enterprise";
  enrolledCourseIds: string[];
  wishlistCourseIds: string[];
  completedCourseIds: string[];
  isEmailVerified?: boolean;
  isApproved?: boolean;
  registeredAt?: string;
  streakPoints?: number;
  dailyStreak?: number;
  lastStreakCheckIn?: string;
  longestStreak?: number;
  darkMode?: boolean;
  phone?: string;
  address?: string;
  lastQuizCompletedDate?: string;
  quizResults?: QuizResult[];
  emailNotifications?: {
    courseApproval: boolean;
    newCourses: boolean;
    weeklyDigest?: boolean;
  };
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  amountUsd: number;
  amountEtb: number;
  paymentMethod: "Telebirr" | "CBE Birr" | "CBE Bank Transfer" | "CBE" | string;
  transactionRef: string;
  receiptImage?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

export interface MentorChatMessage {
  id: string;
  sender: "student" | "mentor";
  senderName: string;
  text: string;
  timestamp: string;
  courseId?: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  certificateCode: string;
  instructorName: string;
  instructorTitle: string;
}
