"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  Eye,
  Clock,
  Plus,
  Search,
  Hash,
} from "lucide-react";
import { useState } from "react";

const categories = [
  "General Discussion",
  "Seller Support",
  "Buyer Tips",
  "Marketplace Updates",
  "Technical Help",
];

const threads = [
  {
    title: "Best practices for international shipping packing?",
    author: "GlobalExports_LTD",
    replies: 12,
    views: 340,
    time: "2h ago",
    tag: "Seller Support",
  },
  {
    title: "Escrow payment release time adjustment",
    author: "TechBuyer_USA",
    replies: 45,
    views: 1200,
    time: "5h ago",
    tag: "Technical Help",
  },
  {
    title: "Introductions: New textile supplier from Surat",
    author: "SuratFabrics",
    replies: 8,
    views: 156,
    time: "1d ago",
    tag: "General Discussion",
  },
  {
    title: "How to verify a buyer's credibility?",
    author: "MachineryPro",
    replies: 23,
    views: 560,
    time: "1d ago",
    tag: "Seller Support",
  },
  {
    title: "Sourcing chemicals safely - Guide",
    author: "ChemSafe",
    replies: 56,
    views: 2300,
    time: "2d ago",
    tag: "Buyer Tips",
  },
];

export default function Forum() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Connect, share, and grow with other business owners.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full bg-background border rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="bg-card border rounded-xl p-4">
            <h3 className="font-bold mb-3 px-2 text-sm uppercase text-muted-foreground">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("All")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "All" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              >
                All Discussions
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeTab === cat ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  {cat}
                  <span className="text-xs bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                    #
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {threads.map((thread, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border hover:border-primary/50 rounded-xl p-4 md:p-6 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" /> {thread.tag}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {thread.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Posted by{" "}
                    <span className="font-semibold text-foreground">
                      {thread.author}
                    </span>
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-muted-foreground">
                  <div className="text-center">
                    <span className="block font-bold text-foreground text-lg">
                      {thread.replies}
                    </span>
                    <span className="text-xs">Replies</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-foreground text-lg">
                      {thread.views}
                    </span>
                    <span className="text-xs">Views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
