import React, { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Star,
  Download,
  Eye,
  PlusCircle,
  CheckCircle2,
  FileCode,
  Layers,
  BookOpen,
  X,
} from "lucide-react";
import { MarketplaceItem } from "../types";

interface MarketplaceProps {
  items: MarketplaceItem[];
}

export const Marketplace: React.FC<MarketplaceProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  // Seller submission form state
  const [sellerTitle, setSellerTitle] = useState("");
  const [sellerCategory, setSellerCategory] = useState("Source Codes");
  const [sellerPrice, setSellerPrice] = useState("29");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const categories = [
    "All",
    "Source Codes",
    "AI Prompts",
    "Templates",
    "E-books",
    "Design Assets",
    "Video Courses",
  ];

  const filteredItems = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const handleBuy = (itemId: string) => {
    if (!purchasedIds.includes(itemId)) {
      setPurchasedIds([...purchasedIds, itemId]);
    }
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sellerTitle) {
      setSubmittedMessage(true);
      setTimeout(() => {
        setSubmittedMessage(false);
        setShowSellModal(false);
        setSellerTitle("");
      }, 2000);
    }
  };

  return (
    <section id="marketplace" className="py-20 md:py-28 bg-white dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              <span>Digital Marketplace</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Developer & Creator Store
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 max-w-xl">
              Download premium SaaS starter kits, Figma design systems, AI prompt libraries, e-books, and motion graphic assets.
            </p>
          </div>

          <button
            onClick={() => setShowSellModal(true)}
            className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Sell Your Products
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-gray-100 dark:border-gray-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isBought = purchasedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {item.rating}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {item.salesCount} downloads
                      </span>
                    </div>

                    <h3
                      onClick={() => setActiveItem(item)}
                      className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-1 hover:text-emerald-600 cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800">
                      <span>By {item.author}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.fileFormat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {Math.round(item.price * 130).toLocaleString()} ETB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleBuy(item.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isBought
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400"
                          : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
                      }`}
                    >
                      {isBought ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Download
                        </>
                      ) : (
                        "Get Instant Access"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative space-y-4">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="w-full h-48 object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                {activeItem.category}
              </span>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-2">
                {activeItem.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activeItem.description}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Includes:</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                {activeItem.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {Math.round(activeItem.price * 130).toLocaleString()} ETB
              </span>
              <button
                onClick={() => {
                  handleBuy(activeItem.id);
                  setActiveItem(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                Purchase & Download Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Your Digital Product Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative">
            <button
              onClick={() => setShowSellModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
              Sell Your Digital Asset
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              List your software source code, design systems, AI prompt libraries, or video courses to 15,000+ Yacob Tech Academy students.
            </p>

            {submittedMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-center font-bold text-xs">
                🎉 Product submitted for review! Our team will contact you shortly.
              </div>
            ) : (
              <form onSubmit={handleSellerSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js SaaS Starter Kit"
                    value={sellerTitle}
                    onChange={(e) => setSellerTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={sellerCategory}
                    onChange={(e) => setSellerCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={sellerPrice}
                    onChange={(e) => setSellerPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
                >
                  Submit Product for Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
