"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/utils";

interface RecentProduct {
    id: number;
    name: string;
    price: string;
    image: string;
    seller: string;
    category: string;
}

export default function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
            setRecentProducts(JSON.parse(stored));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("recentlyViewed");
        setRecentProducts([]);
    };

    if (recentProducts.length === 0) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg md:text-xl font-bold">Recently Viewed</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={clearHistory}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Clear
                    </button>
                    <Link
                        href="/marketplace"
                        className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {recentProducts.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex-shrink-0 w-[140px] md:w-[180px]"
                    >
                        <Link
                            href={`/product/${slugify(product.seller)}/${slugify(product.name)}`}
                            className="block bg-background border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                        >
                            <div className="relative aspect-square bg-muted">
                                {product.image.startsWith("http") ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                        📦
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-medium truncate">{product.name}</p>
                                <p className="text-xs text-primary font-bold">{product.price}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}

export function addToRecentlyViewed(product: RecentProduct) {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("recentlyViewed");
    const existing: RecentProduct[] = stored ? JSON.parse(stored) : [];

    const filtered = existing.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
}
