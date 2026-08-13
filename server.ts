import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import mongoose from "mongoose";

// Persistent File Database Engine Setup
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DBStore {
  receipts: any[];
  students: any[];
  courses: any[];
  reviews: any[];
  contactMessages: any[];
}

const defaultReviews = [
  {
    id: "rev-1",
    courseId: "course-1",
    studentName: "Dawit Tadesse",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Outstanding Python & AI track! The practical projects helped me build my first machine learning model easily.",
    createdAt: "August 1, 2026",
  },
];

const defaultReceipts: any[] = [];

const defaultStudents: any[] = [];

function loadDBStore(): DBStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read db.json file, falling back to defaults", err);
  }
  const initial = {
    receipts: defaultReceipts,
    students: defaultStudents,
    courses: [],
    reviews: defaultReviews,
    contactMessages: [],
  };
  saveDBStore(initial);
  return initial;
}

function saveDBStore(data: DBStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db.json file", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Load persistent DB store
  let dbStore = loadDBStore();

  // --- MERN Stack Database Connection & Models ---
  let mongoConnected = false;
  let mongoDatabaseName = "yacob_tech_academy_db";

  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/yacob_tech_academy_db";

  try {
    // Attempt Mongoose connection with fast timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 500 });
    mongoConnected = true;
    console.log("MongoDB Mongoose connected successfully!");
  } catch (err) {
    console.warn("MongoDB connection deferred or running in MERN simulated memory store mode.");
    mongoConnected = false;
  }

  // Mongoose Schemas for MERN Architecture
  const courseSchema = new mongoose.Schema({
    id: String,
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    category: String,
    price: Number,
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 12 },
    studentsEnrolled: { type: Number, default: 450 },
    duration: String,
    lessonsCount: { type: Number, default: 24 },
    level: String,
    image: String,
    tags: [String],
    instructor: {
      name: String,
      title: String,
      company: String,
      avatar: String,
    },
    createdAt: { type: Date, default: Date.now },
  });

  const receiptSchema = new mongoose.Schema({
    id: String,
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: String,
    amountUsd: Number,
    amountEtb: Number,
    paymentMethod: String,
    transactionRef: { type: String, required: true },
    receiptImage: String,
    submittedAt: { type: String, default: () => new Date().toLocaleString() },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    notes: String,
  });

  const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "Student" },
    plan: { type: String, default: "Pro" },
    isEmailVerified: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    registeredAt: { type: String, default: () => new Date().toLocaleString() },
  });

  const CourseModel = mongoose.models.Course || mongoose.model("Course", courseSchema);
  const ReceiptModel = mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
  const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

  // In-Memory fallback store for course reviews
  let inMemoryReviews: any[] = [
    {
      id: "rev-1",
      courseId: "course-1",
      studentName: "Dawit Tadesse",
      studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "Outstanding Python & AI track! The practical projects helped me build my first machine learning model easily.",
      createdAt: "August 1, 2026",
    },
    {
      id: "rev-2",
      courseId: "course-2",
      studentName: "Bethlehem Haile",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "Full-Stack Web Development track is super clear! Loved learning React 19 and Node Express with Telebirr integration examples.",
      createdAt: "August 5, 2026",
    },
    {
      id: "rev-3",
      courseId: "course-3",
      studentName: "Elias Worku",
      studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "Great UI/UX & Graphic Design course. Yacob Tech Academy is the best online learning platform in Ethiopia!",
      createdAt: "August 8, 2026",
    },
  ];

  // In-Memory fallback store for full backend functionality
  let inMemoryReceipts: any[] = [
    {
      id: "rcpt-101",
      courseId: "course-2",
      courseTitle: "Full-Stack Web Development Bootcamp (React 19 & Express)",
      studentName: "Samuel Bekele",
      studentEmail: "samuel.bekele@gmail.com",
      studentPhone: "+251 911 482 910",
      amountUsd: 69,
      amountEtb: 8970,
      paymentMethod: "CBE",
      transactionRef: "CBE-984210385",
      receiptImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      submittedAt: "July 23, 2026, 11:30 AM",
      status: "pending",
      notes: "Transferred via CBE Birr App",
    },
  ];

  let inMemoryStudents: any[] = [
    {
      id: "usr-student-demo",
      name: "Yaikob Diriba",
      email: "yaikobdiriba22@gmail.com",
      role: "Student",
      plan: "Pro",
      isEmailVerified: true,
      isApproved: true,
      registeredAt: "July 20, 2026",
    },
    {
      id: "usr-pending-1",
      name: "Abebe Bikila",
      email: "abebe.bikila@gmail.com",
      role: "Student",
      plan: "Pro",
      isEmailVerified: true,
      isApproved: false,
      registeredAt: "August 11, 2026",
    },
    {
      id: "usr-pending-2",
      name: "Tigist Alemu",
      email: "tigist.alemu@gmail.com",
      role: "Student",
      plan: "Pro",
      isEmailVerified: true,
      isApproved: false,
      registeredAt: "August 11, 2026",
    },
  ];

  let inMemoryCourses: any[] = [];

  // Shared Gemini client setup
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing in environment variables.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "Yacob Tech Academy MERN API",
      stack: "MongoDB + Express + React 19 + Node.js",
      timestamp: new Date().toISOString(),
    });
  });

  // MERN Stack Status Endpoint
  app.get("/api/mern/status", (_req, res) => {
    res.json({
      architecture: "MERN Stack (MongoDB, Express, React, Node.js)",
      database: {
        type: "MongoDB (Mongoose ODM)",
        status: mongoConnected ? "Connected (Live MongoDB)" : "Active (MERN Database Engine)",
        databaseName: mongoDatabaseName,
        collections: ["courses", "receipts", "users", "quizzes"],
      },
      backend: {
        framework: "Express.js 4.x",
        environment: "Node.js (TypeScript)",
        port: PORT,
      },
      frontend: {
        library: "React 19 with Vite & Tailwind CSS",
      },
    });
  });

  // MERN REST Endpoint: GET receipts
  app.get("/api/receipts", async (_req, res) => {
    try {
      if (mongoConnected) {
        const dbReceipts = await ReceiptModel.find().sort({ _id: -1 });
        return res.json({ receipts: dbReceipts });
      }
      return res.json({ receipts: dbStore.receipts });
    } catch (err) {
      return res.json({ receipts: dbStore.receipts });
    }
  });

  // MERN REST Endpoint: POST submit receipt
  app.post("/api/receipts", async (req, res) => {
    try {
      const receiptData = req.body;
      if (!receiptData.courseId || !receiptData.studentName) {
        return res.status(400).json({ error: "Missing required receipt fields" });
      }

      if (mongoConnected) {
        const created = await ReceiptModel.create(receiptData);
        return res.status(201).json({ receipt: created, message: "Receipt saved to MongoDB!" });
      }

      const newReceipt = {
        id: receiptData.id || `rcpt-${Date.now()}`,
        ...receiptData,
        submittedAt: receiptData.submittedAt || new Date().toLocaleString(),
        status: receiptData.status || "pending",
      };
      dbStore.receipts.unshift(newReceipt);
      saveDBStore(dbStore);
      return res.status(201).json({ receipt: newReceipt, message: "Receipt saved to persistent backend store!" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to create receipt", details: err?.message });
    }
  });

  // MERN REST Endpoint: PATCH receipt status
  app.patch("/api/receipts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (mongoConnected) {
        await (ReceiptModel as any).updateOne({ id }, { status });
        const updated = await (ReceiptModel as any).findOne({ id });
        if (updated) {
          return res.json({ receipt: updated });
        }
      }

      dbStore.receipts = dbStore.receipts.map((r) =>
        r.id === id ? { ...r, status } : r
      );
      saveDBStore(dbStore);
      const found = dbStore.receipts.find((r) => r.id === id);
      return res.json({ receipt: found });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update receipt status", details: err?.message });
    }
  });

  // REST Endpoint: DELETE receipt
  app.delete("/api/receipts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (mongoConnected) {
        await (ReceiptModel as any).deleteOne({ id });
      }
      dbStore.receipts = dbStore.receipts.filter((r) => r.id !== id);
      saveDBStore(dbStore);
      return res.json({ success: true, message: "Receipt deleted from database" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete receipt" });
    }
  });

  // --- Student Registration & Admin Approval REST Endpoints ---
  // GET /api/students
  app.get("/api/students", async (_req, res) => {
    try {
      if (mongoConnected) {
        const dbUsers = await UserModel.find().sort({ _id: -1 });
        if (dbUsers && dbUsers.length > 0) {
          return res.json({ students: dbUsers });
        }
      }
      return res.json({ students: dbStore.students });
    } catch (err) {
      return res.json({ students: dbStore.students });
    }
  });

  // POST /api/students/register
  app.post("/api/students/register", async (req, res) => {
    try {
      const studentData = req.body;
      if (!studentData.email || !studentData.name) {
        return res.status(400).json({ error: "Name and Email are required" });
      }

      const isApproved = studentData.role === "Admin" ? true : (studentData.isApproved ?? false);
      const newStudent = {
        id: studentData.id || `usr-${Date.now()}`,
        name: studentData.name,
        email: studentData.email,
        role: studentData.role || "Student",
        plan: studentData.plan || "Pro",
        isEmailVerified: studentData.isEmailVerified ?? true,
        isApproved,
        registeredAt: new Date().toLocaleString(),
      };

      if (mongoConnected) {
        await UserModel.create(newStudent);
      }

      const existingIdx = dbStore.students.findIndex((s) => s.email.toLowerCase() === newStudent.email.toLowerCase());
      if (existingIdx >= 0) {
        dbStore.students[existingIdx] = newStudent;
      } else {
        dbStore.students.unshift(newStudent);
      }
      saveDBStore(dbStore);

      return res.status(201).json({
        student: newStudent,
        message: isApproved ? "Student registered and approved!" : "Student registered successfully! Pending admin approval.",
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to register student", details: err?.message });
    }
  });

  // POST /api/auth/login
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = dbStore.students.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Return clear error or register demo
        return res.status(404).json({ error: "Student account not found. Please register first." });
      }

      return res.json({
        user,
        message: user.isApproved ? "Login successful!" : "Account pending admin approval.",
      });
    } catch (err: any) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // PATCH /api/students/:id/approve
  app.patch("/api/students/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;

      if (mongoConnected) {
        await (UserModel as any).updateOne({ id }, { isApproved });
      }

      dbStore.students = dbStore.students.map((s) =>
        s.id === id ? { ...s, isApproved } : s
      );
      saveDBStore(dbStore);

      const updated = dbStore.students.find((s) => s.id === id);
      return res.json({ student: updated, message: isApproved ? "Student approved successfully!" : "Student approval revoked." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update student approval", details: err?.message });
    }
  });

  // DELETE /api/students/:id
  app.delete("/api/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (mongoConnected) {
        await (UserModel as any).deleteOne({ id });
      }
      dbStore.students = dbStore.students.filter((s) => s.id !== id);
      saveDBStore(dbStore);
      return res.json({ success: true, message: "Student record deleted." });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  // --- Course Reviews REST Endpoints ---
  // GET /api/courses/:id/reviews
  app.get("/api/courses/:id/reviews", (req, res) => {
    const { id } = req.params;
    const reviews = dbStore.reviews.filter((r) => r.courseId === id);
    const total = reviews.length;
    const avgRating = total > 0
      ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1))
      : 5.0;

    return res.json({
      reviews,
      count: total,
      averageRating: avgRating,
    });
  });

  // POST /api/courses/:id/reviews
  app.post("/api/courses/:id/reviews", (req, res) => {
    try {
      const { id } = req.params;
      const { studentName, studentAvatar, rating, comment } = req.body;

      if (!comment || !rating) {
        return res.status(400).json({ error: "Rating and feedback comment are required" });
      }

      const newReview = {
        id: `rev-${Date.now()}`,
        courseId: id,
        studentName: studentName || "Anonymous Student",
        studentAvatar: studentAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        rating: Number(rating) || 5,
        comment,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };

      dbStore.reviews.unshift(newReview);
      saveDBStore(dbStore);

      const courseReviews = dbStore.reviews.filter((r) => r.courseId === id);
      const total = courseReviews.length;
      const avgRating = Number((courseReviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1));

      return res.status(201).json({
        review: newReview,
        count: total,
        averageRating: avgRating,
        message: "Review submitted successfully!",
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // --- Contact & Inquiries REST Endpoints ---
  // POST /api/contact
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, phone, topic, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email and message are required" });
      }

      const newMessage = {
        id: `msg-${Date.now()}`,
        name,
        email,
        phone: phone || "",
        topic: topic || "Course Enrollment",
        subject: subject || "",
        message,
        createdAt: new Date().toLocaleString(),
      };

      dbStore.contactMessages.unshift(newMessage);
      saveDBStore(dbStore);

      return res.status(201).json({
        message: "Inquiry saved to backend database! Our team will respond shortly.",
        data: newMessage,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to record inquiry" });
    }
  });

  // GET /api/contact
  app.get("/api/contact", (_req, res) => {
    return res.json({ messages: dbStore.contactMessages });
  });

  // GET /api/admin/stats
  app.get("/api/admin/stats", (_req, res) => {
    const totalStudents = dbStore.students.length;
    const approvedStudents = dbStore.students.filter((s) => s.isApproved).length;
    const pendingStudents = dbStore.students.filter((s) => !s.isApproved).length;
    const totalReceipts = dbStore.receipts.length;
    const approvedReceipts = dbStore.receipts.filter((r) => r.status === "approved").length;
    const pendingReceipts = dbStore.receipts.filter((r) => r.status === "pending").length;

    const totalRevenueEtb = dbStore.receipts
      .filter((r) => r.status === "approved")
      .reduce((acc, r) => acc + (r.amountEtb || 0), 0);

    return res.json({
      students: { total: totalStudents, approved: approvedStudents, pending: pendingStudents },
      receipts: { total: totalReceipts, approved: approvedReceipts, pending: pendingReceipts },
      revenueEtb: totalRevenueEtb,
      reviewsCount: dbStore.reviews.length,
      contactMessagesCount: dbStore.contactMessages.length,
    });
  });

  // --- Customer Assistant AI Endpoint ---
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGenAI();
      const systemInstruction = `You are Yacob Tech Academy Customer Support AI Assistant 🤖🇪🇹.
Your role is to assist prospective students, enrolled learners, and visitors with clear, warm, and helpful information about Yacob Tech Academy Ethiopia.
Key platform facts:
1. Registration & Approval: All new student registrations require Admin Verification & Approval before gaining access to course tracks.
2. Payment Methods & Verification:
   - Telebirr / CBE Birr Account: 0906521758 (Account Name: Yaikob Diriba)
   - Commercial Bank of Ethiopia (CBE) Account: 1000425428016
   - Students submit receipt references/photos via the "Fee Payment Receipt" button to unlock courses.
3. Offered Tracks: Full-Stack Web Development, AI & Machine Learning, Mobile App Dev (Flutter/React Native), Graphic Design & UI/UX, Cyber Security, Video Editing & Motion Graphics, Python Automation, Cloud Computing.
4. Certificates: Official verifiable certificates are awarded upon course completion.
5. Admin Portal: System administrators review payment receipts, approve student registrations, and manage learning tracks.

Provide concise, friendly, helpful answers in clear English with warm Ethiopian greetings (Selam 🇪🇹) where appropriate. Use bullet points for steps or account numbers.`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? [...history, { role: "user", parts: [{ text: message }] }]
        : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "Selam! How can I assist you today with course registration, payments, or approvals at Yacob Tech Academy?";
      res.json({ reply });
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      res.status(500).json({
        error: "Failed to communicate with Customer AI Assistant",
        details: err?.message || String(err),
      });
    }
  });

  // 1. AI Tutor Endpoint
  app.post("/api/ai-tutor", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGenAI();
      const systemInstruction = `You are Yacob AI Tutor, an expert, encouraging, and highly articulate senior lead developer and academic mentor at Yacob Tech Academy.
Your goal is to help students learn programming, AI, graphic design, cloud computing, cyber security, video editing, and business skills.
Provide concise, clear, and well-formatted answers with practical examples and code snippets where relevant.
Always respond with encouraging words and clear step-by-step explanations.
${context ? `Current context or course focus: ${context}` : ""}`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? [...history, { role: "user", parts: [{ text: message }] }]
        : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I'm sorry, I couldn't generate a response right now. Please try asking again!";
      res.json({ reply });
    } catch (err: any) {
      console.error("AI Tutor error:", err);
      res.status(500).json({
        error: "Failed to communicate with AI Tutor",
        details: err?.message || String(err),
      });
    }
  });

  // 2. AI Quiz Generator
  app.post("/api/generate-quiz", async (req, res) => {
    try {
      const { topic, difficulty = "Intermediate" } = req.body;
      const ai = getGenAI();

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Generate a 4-question multiple choice quiz on the topic of "${topic || "Web Development"}" at ${difficulty} level for a student at Yacob Tech Academy.
Return a JSON array of questions. Each question must have:
- question (string)
- options (array of 4 strings)
- correctAnswerIndex (number 0-3)
- explanation (string explain why that answer is correct)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of quiz questions",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctAnswerIndex", "explanation"],
            },
          },
        },
      });

      const jsonText = response.text || "[]";
      const quiz = JSON.parse(jsonText);
      res.json({ quiz });
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      res.status(500).json({ error: "Failed to generate quiz", details: err?.message || String(err) });
    }
  });

  // 3. AI Code Review Endpoint
  app.post("/api/code-review", async (req, res) => {
    try {
      const { code, language = "TypeScript" } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      const ai = getGenAI();
      const prompt = `Review the following ${language} code provided by a Yacob Tech Academy student.
Analyze it for bugs, efficiency, security, code style, and modern best practices.
Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide feedback structured as JSON with:
1. score (number 1-100)
2. summary (short summary paragraph)
3. keyStrengths (array of strings)
4. areaForImprovement (array of strings)
5. optimizedCode (string containing refactored/improved code)
6. explanationOfFixes (string explaining changes made)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areaForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
              optimizedCode: { type: Type.STRING },
              explanationOfFixes: { type: Type.STRING },
            },
            required: ["score", "summary", "keyStrengths", "areaForImprovement", "optimizedCode", "explanationOfFixes"],
          },
        },
      });

      const reviewData = JSON.parse(response.text || "{}");
      res.json({ review: reviewData });
    } catch (err: any) {
      console.error("Code review error:", err);
      res.status(500).json({ error: "Failed to perform code review", details: err?.message || String(err) });
    }
  });

  // 4. AI Project Ideas Generator
  app.post("/api/project-ideas", async (req, res) => {
    try {
      const { skillLevel = "Intermediate", track = "Full Stack Development" } = req.body;
      const ai = getGenAI();

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Suggest 3 hands-on portfolio project ideas for a student studying "${track}" at ${skillLevel} level at Yacob Tech Academy.
Return a JSON array where each project has:
- title (string)
- description (string)
- estimatedHours (string)
- keyTechnologies (array of strings)
- keyDeliverables (array of strings)
- careerImpact (string)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedHours: { type: Type.STRING },
                keyTechnologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyDeliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                careerImpact: { type: Type.STRING },
              },
              required: ["title", "description", "estimatedHours", "keyTechnologies", "keyDeliverables", "careerImpact"],
            },
          },
        },
      });

      const projects = JSON.parse(response.text || "[]");
      res.json({ projects });
    } catch (err: any) {
      console.error("Project ideas error:", err);
      res.status(500).json({ error: "Failed to generate project ideas", details: err?.message || String(err) });
    }
  });

  // 5. AI Career Roadmap Generator Endpoint
  app.post("/api/ai-roadmap", async (req, res) => {
    try {
      const {
        careerGoal,
        currentSkills,
        experienceLevel = "Beginner",
        weeklyHours = "10-15 hours/week",
        availableCourses = [],
      } = req.body;

      if (!careerGoal) {
        return res.status(400).json({ error: "Career goal is required" });
      }

      const ai = getGenAI();

      const courseListContext =
        Array.isArray(availableCourses) && availableCourses.length > 0
          ? availableCourses
              .map(
                (c: any) =>
                  `- "${c.title}" (Category: ${c.category}, Level: ${c.level}, Duration: ${c.duration}, ID: ${c.id})`
              )
              .join("\n")
          : `- "Full-Stack Web Development Bootcamp (React 19 & Express)"\n- "Python & AI Engineering Track (Gemini, PyTorch & Agents)"\n- "Mobile App Development with Flutter & React Native"\n- "UI/UX & Graphic Design Mastery"\n- "Cyber Security & Ethical Hacking Essentials"\n- "Modern Database Systems (MongoDB, PostgreSQL & Firebase)"`;

      const prompt = `You are the Lead Tech Career Counselor and Chief Academic Officer at Yacob Tech Academy Ethiopia.
A student has requested a customized step-by-step career roadmap to achieve their goal.

Student Profile:
- Target Career Goal: ${careerGoal}
- Current Skill Set & Background: ${currentSkills || "Beginner with basic computer literacy"}
- Current Experience Level: ${experienceLevel}
- Available Weekly Study Time: ${weeklyHours}

Available Yacob Tech Academy Courses:
${courseListContext}

Generate a comprehensive, highly practical, sequence-ordered learning roadmap tailored to this student's exact goal.
Structure your response strictly as JSON matching this schema:
- roadmapTitle: string
- careerSummary: string
- estimatedTimeToGoal: string
- recommendedRoleTitle: string
- targetSalaryRange: string
- steps: array of 3 to 5 sequence-ordered objects:
    - stepNumber: integer (1, 2, 3...)
    - phaseTitle: string
    - duration: string
    - matchedCourseTitle: string
    - matchedCourseId: string
    - keySkillsToMaster: array of strings (3-5 specific skills)
    - practicalProject: string
    - whyThisStep: string
- careerAdvice: array of strings (3 actionable advice points)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmapTitle: { type: Type.STRING },
              careerSummary: { type: Type.STRING },
              estimatedTimeToGoal: { type: Type.STRING },
              recommendedRoleTitle: { type: Type.STRING },
              targetSalaryRange: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    phaseTitle: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    matchedCourseTitle: { type: Type.STRING },
                    matchedCourseId: { type: Type.STRING },
                    keySkillsToMaster: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    practicalProject: { type: Type.STRING },
                    whyThisStep: { type: Type.STRING },
                  },
                  required: [
                    "stepNumber",
                    "phaseTitle",
                    "duration",
                    "matchedCourseTitle",
                    "keySkillsToMaster",
                    "practicalProject",
                    "whyThisStep",
                  ],
                },
              },
              careerAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "roadmapTitle",
              "careerSummary",
              "estimatedTimeToGoal",
              "recommendedRoleTitle",
              "steps",
              "careerAdvice",
            ],
          },
        },
      });

      const jsonText = response.text || "{}";
      const roadmap = JSON.parse(jsonText);
      res.json({ roadmap });
    } catch (err: any) {
      console.error("Roadmap generation error:", err);
      res.status(500).json({
        error: "Failed to generate AI career roadmap",
        details: err?.message || String(err),
      });
    }
  });

  // POST /api/ai-lesson-quiz
  app.post("/api/ai-lesson-quiz", async (req, res) => {
    try {
      const { courseTitle, lessonTitle, level } = req.body;
      const ai = getGenAI();

      const prompt = `You are a Senior Technical Instructor at Yacob Tech Academy.
Create 5 interactive multiple-choice quiz questions to test student comprehension after finishing the lesson "${lessonTitle}" in the course "${courseTitle}" (${level || "Intermediate"} level).

Requirements for each question:
- Clear, practical question testing core concepts covered in "${lessonTitle}".
- Exactly 4 distinct multiple-choice options.
- Zero-based index (0, 1, 2, or 3) of the correct answer.
- Concise, clear explanation of why the correct answer is right and why it matters in practical software development.

Format as JSON object with key "questions".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: [
                    "question",
                    "options",
                    "correctAnswerIndex",
                    "explanation",
                  ],
                },
              },
            },
            required: ["questions"],
          },
        },
      });

      const jsonText = response.text || "{}";
      const data = JSON.parse(jsonText);
      res.json({ questions: data.questions || [] });
    } catch (err: any) {
      console.error("AI Lesson Quiz generation error:", err);
      res.status(500).json({
        error: "Failed to generate AI lesson quiz",
        details: err?.message || String(err),
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Yacob Tech Academy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
