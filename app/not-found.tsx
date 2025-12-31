"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MoveLeft,
  Home,
  Search,
  ShoppingBag,
  FileQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen pt-[80px] md:pt-[100px] flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          <h1 className="text-[120px] md:text-[200px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600 select-none opacity-20 dark:opacity-30 blur-sm">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              404
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-md mx-auto mb-10 relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border-2 border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-colors text-sm md:text-base shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Home className="w-4 h-4" />
                Go Home
              </motion.button>
            </Link>

            <Link href="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-card border-2 border-border px-6 py-3 rounded-xl font-bold hover:border-primary/50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Marketplace
              </motion.button>
            </Link>

            <button onClick={() => router.back()}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-card border-2 border-border px-6 py-3 rounded-xl font-bold hover:border-primary/50 transition-colors"
              >
                <MoveLeft className="w-4 h-4" />
                Go Back
              </motion.button>
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Popular Pages</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
              <Link
                href="/seller"
                className="hover:text-primary transition-colors"
              >
                Sellers
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/rfq"
                className="hover:text-primary transition-colors"
              >
                RFQ
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
