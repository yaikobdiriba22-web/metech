import React, { useState } from "react";
import { X, Upload, CheckCircle2, ShieldCheck, CreditCard, Building2, Smartphone, FileText, Image, ArrowRight } from "lucide-react";
import { Course, User, PaymentReceipt } from "../types";

interface PaymentReceiptModalProps {
  course: Course;
  user: User | null;
  onClose: () => void;
  onSubmitReceipt: (receipt: PaymentReceipt) => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  course,
  user,
  onClose,
  onSubmitReceipt,
}) => {
  const etbAmount = course.price;

  const [paymentMethod, setPaymentMethod] = useState<"Telebirr" | "CBE Birr" | "CBE Bank Transfer">("Telebirr");
  const [studentName, setStudentName] = useState(user?.name || "");
  const [studentEmail, setStudentEmail] = useState(user?.email || "");
  const [studentPhone, setStudentPhone] = useState("+251 ");
  const [transactionRef, setTransactionRef] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) return;

    const newReceipt: PaymentReceipt = {
      id: `rcpt-${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      studentName: studentName || "Student",
      studentEmail: studentEmail || "student@example.com",
      studentPhone,
      amountUsd: course.price,
      amountEtb: etbAmount,
      paymentMethod,
      transactionRef: transactionRef.trim(),
      receiptImage: receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
      submittedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      notes,
    };

    onSubmitReceipt(newReceipt);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <span>🇪🇹 Ethiopian Telebirr & CBE Birr Payment Gateway</span>
            <span>•</span>
            <span>Course Fee Receipt</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">Pay Course Fee & Unlock Study Access</h2>
          <p className="text-xs text-emerald-100 mt-1 line-clamp-1">
            "{course.title}"
          </p>

          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-200 uppercase font-semibold">Course Fee (Ethiopian Birr)</p>
              <p className="text-2xl font-black text-amber-300">{course.price.toLocaleString()} ETB</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 text-white text-[10px] font-extrabold uppercase">
                ETB ONLY (Min 1,500 - Max 2,500 ETB)
              </span>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Payment Receipt Uploaded! Ready to Study 🎉
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              Your transaction reference <strong className="text-emerald-600 font-mono">{transactionRef}</strong> has been logged into the MERN database. You can now immediately access your course modules and study!
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>⚡ Unlocked Access:</span> Anyone can study right after finishing payment!
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Receipts sent to <strong>0906521758</strong> are verified automatically. Enjoy learning!
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
            >
              Start Studying Now 🚀
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Primary Official Payment Alert Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-gray-900 dark:text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Official Fee Transfer Channels
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-extrabold text-[10px]">
                  VERIFIED ACCOUNTS
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-emerald-200 dark:border-emerald-800/60">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">1. Telebirr</p>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">0906521758</p>
                  <p className="text-[9px] text-gray-500">Yaikob Diriba</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-purple-200 dark:border-purple-800/60">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">2. CBE Birr</p>
                  <p className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">0906521758</p>
                  <p className="text-[9px] text-gray-500">Yaikob Diriba</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-blue-200 dark:border-blue-800/60">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">3. CBE Bank Account</p>
                  <p className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">1000425428016</p>
                  <p className="text-[9px] text-gray-500">CBE Account</p>
                </div>
              </div>
            </div>

            {/* Payment Options Selection */}
            <div>
              <label className="block font-bold text-gray-900 dark:text-white mb-2">
                1. Select Payment Channel (Telebirr, CBE Birr & CBE Bank Transfer Only):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { name: "Telebirr", icon: Smartphone, details: "0906521758 (Telebirr)", color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
                  { name: "CBE Birr", icon: Smartphone, details: "0906521758 (CBE Birr)", color: "border-purple-500 bg-purple-50 dark:bg-purple-950/40" },
                  { name: "CBE Bank Transfer", icon: Building2, details: "1000425428016 (CBE Account)", color: "border-blue-500 bg-blue-50 dark:bg-blue-950/40" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setPaymentMethod(item.name as any)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === item.name
                        ? `${item.color} ring-2 ring-emerald-500 font-bold`
                        : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-gray-900 dark:text-white">{item.name}</span>
                      <item.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate font-mono font-semibold">
                      {item.details}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Account Details Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-emerald-900 dark:text-emerald-200">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  Target Account: Yacob Tech Academy / Yaikob Diriba
                </p>
                <p className="text-sm font-extrabold mt-0.5 font-mono">
                  {paymentMethod === "Telebirr" && "Telebirr: 0906521758"}
                  {paymentMethod === "CBE Birr" && "CBE Birr: 0906521758"}
                  {paymentMethod === "CBE Bank Transfer" && "CBE Bank Account: 1000425428016"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-1 rounded-full font-extrabold">
                  {etbAmount.toLocaleString()} ETB
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Yaikob Diriba"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="e.g. yaikobdiriba22@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+251 911 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                    Transaction Ref / Reference No *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. CBE9842103 or TEL771290"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Upload Screenshot File */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Upload Receipt Screenshot / Photo (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {receiptImage ? (
                    <div className="space-y-2">
                      <img
                        src={receiptImage}
                        alt="Receipt Preview"
                        className="h-28 mx-auto rounded-lg object-contain border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Upload className="w-6 h-6 text-emerald-600" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Click or drag & drop payment receipt screenshot
                      </span>
                      <span className="text-[10px] text-gray-400">PNG, JPG or PDF (Max 10MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <p className="text-[11px] text-gray-500">
                🔒 Secure 256-Bit SSL Encrypted Approval
              </p>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <span>Submit Receipt for Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
