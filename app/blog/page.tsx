"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    slug: "top-b2b-trends-2025",
    title: "Top B2B Marketing Trends for 2025",
    excerpt:
      "Discover the strategies that will define the future of business-to-business commerce.",
    date: "Dec 28, 2024",
    category: "Trends",
  },
  {
    slug: "optimizing-supply-chain",
    title: "How to Optimize Your Supply Chain",
    excerpt:
      "Learn how to reduce costs and improve efficiency in your logistics operations.",
    date: "Dec 25, 2024",
    category: "Logistics",
  },
  {
    slug: "digital-transformation-manufacturing",
    title: "Digital Transformation in Manufacturing",
    excerpt:
      "Why manufacturers must adapt to new technologies to stay competitive.",
    date: "Dec 20, 2024",
    category: "Technology",
  },
];

export default function BlogList() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Latest Insights</h1>
        <p className="text-muted-foreground text-lg">
          News, tips, and trends from the world of B2B.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-card border-2 border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                {post.category}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3 h-3" />
                {post.date}
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary font-bold text-sm flex items-center gap-1 group/link"
              >
                Read Article{" "}
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
