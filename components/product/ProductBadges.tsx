"use client";

import { motion } from "framer-motion";
import { Package, Percent, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MOQBadgeProps {
    moq: number;
    className?: string;
}

export function MOQBadge({ moq, className }: MOQBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold",
                className
            )}
        >
            <Package className="w-3 h-3" />
            MOQ: {moq}
        </div>
    );
}

interface BulkDiscountBadgeProps {
    discounts: { minQty: number; discount: number }[];
    className?: string;
}

export function BulkDiscountBadge({ discounts, className }: BulkDiscountBadgeProps) {
    const maxDiscount = Math.max(...discounts.map((d) => d.discount));

    if (maxDiscount === 0) return null;

    return (
        <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-[10px] font-bold",
                className
            )}
        >
            <TrendingDown className="w-3 h-3" />
            Up to {maxDiscount}% off
        </motion.div>
    );
}

interface CreditTermsBadgeProps {
    terms: string;
    className?: string;
}

export function CreditTermsBadge({ terms, className }: CreditTermsBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-bold",
                className
            )}
        >
            💳 {terms}
        </div>
    );
}

interface SampleAvailableBadgeProps {
    className?: string;
}

export function SampleAvailableBadge({ className }: SampleAvailableBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-bold",
                className
            )}
        >
            📦 Samples Available
        </div>
    );
}

interface VerifiedSellerBadgeProps {
    tier?: "Gold" | "Silver" | "Bronze";
    className?: string;
}

export function VerifiedSellerBadge({ tier = "Gold", className }: VerifiedSellerBadgeProps) {
    const colors = {
        Gold: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        Silver: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
        Bronze: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                colors[tier],
                className
            )}
        >
            ✓ {tier} Verified
        </div>
    );
}

interface OnlineStatusBadgeProps {
    isOnline: boolean;
    className?: string;
}

export function OnlineStatusBadge({ isOnline, className }: OnlineStatusBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-medium",
                className
            )}
        >
            <span
                className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )}
            />
            {isOnline ? "Online Now" : "Offline"}
        </div>
    );
}
