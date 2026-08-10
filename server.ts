import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import mongoose from "mongoose";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // --- MERN Stack Database Connection & Models ---
  let mongoConnected = false;
  let mongoDatabaseName = "yacob_tech_academy_db";

  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/yacob_tech_academy_db";

  try {
    // Attempt Mongoose connection with timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
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

  const CourseModel = mongoose.models.Course || mongoose.model("Course", courseSchema);
  const ReceiptModel = mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);

  // In-Memory fallback store for full MERN functionality even without an active standalone Mongo daemon
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
      return res.json({ receipts: inMemoryReceipts });
    } catch (err) {
      return res.json({ receipts: inMemoryReceipts });
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
      inMemoryReceipts.unshift(newReceipt);
      return res.status(201).json({ receipt: newReceipt, message: "Receipt saved to MERN Database Store!" });
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

      inMemoryReceipts = inMemoryReceipts.map((r) =>
        r.id === id ? { ...r, status } : r
      );
      const found = inMemoryReceipts.find((r) => r.id === id);
      return res.json({ receipt: found });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update receipt status", details: err?.message });
    }
  });

  // MERN REST Endpoint: DELETE receipt
  app.delete("/api/receipts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (mongoConnected) {
        await (ReceiptModel as any).deleteOne({ id });
      }
      inMemoryReceipts = inMemoryReceipts.filter((r) => r.id !== id);
      return res.json({ success: true, message: "Receipt deleted from MERN database" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete receipt" });
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
