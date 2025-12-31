"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { products } from "@/lib/data";

interface CustomersAlsoBoughtProps {
    currentProductId: number;
    category: string;
    limit?: number;
}

export default function CustomersAlsoBought({
    currentProductId,
    category,
    limit = 4,
}: CustomersAlsoBoughtProps) {
    const relatedProducts = products
        .filter((p) => p.id !== currentProductId && p.category === category)
        .slice(0, limit);

    if (relatedProducts.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm">Customers Also Bought</h3>
                </div>
                <Link
                    href={`/marketplace?category=${slugify(category)}`}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {relatedProducts.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link
                            href={`/product/${slugify(product.seller || "verified-seller")}/${slugify(product.name)}`}
                            className="block bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
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
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-primary font-bold">{product.price}</span>
                                    <span className="text-[10px] text-muted-foreground">⭐ {product.rating}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
