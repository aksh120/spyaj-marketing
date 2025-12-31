"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Percent, Package, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkDiscount {
    minQty: number;
    discount: number;
}

interface BulkOrderCalculatorProps {
    basePrice: number;
    currency?: string;
    moq?: number;
    bulkDiscounts?: BulkDiscount[];
}

const defaultDiscounts: BulkDiscount[] = [
    { minQty: 100, discount: 0 },
    { minQty: 500, discount: 5 },
    { minQty: 1000, discount: 10 },
    { minQty: 5000, discount: 15 },
    { minQty: 10000, discount: 20 },
];

export default function BulkOrderCalculator({
    basePrice,
    currency = "₹",
    moq = 100,
    bulkDiscounts = defaultDiscounts,
}: BulkOrderCalculatorProps) {
    const [quantity, setQuantity] = useState(moq);
    const [activeDiscount, setActiveDiscount] = useState(0);

    useEffect(() => {
        const applicableDiscount = bulkDiscounts
            .filter((d) => quantity >= d.minQty)
            .sort((a, b) => b.discount - a.discount)[0];
        setActiveDiscount(applicableDiscount?.discount || 0);
    }, [quantity, bulkDiscounts]);

    const discountedPrice = basePrice * (1 - activeDiscount / 100);
    const totalPrice = discountedPrice * quantity;
    const savings = basePrice * quantity - totalPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4 space-y-4"
        >
            <div className="flex items-center gap-2 text-sm font-bold">
                <Calculator className="w-4 h-4 text-primary" />
                Bulk Order Calculator
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        Quantity (MOQ: {moq})
                    </label>
                    <input
                        type="number"
                        min={moq}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(moq, parseInt(e.target.value) || moq))}
                        className="w-full bg-background border-2 border-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary transition-colors"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {bulkDiscounts.map((tier) => (
                        <button
                            key={tier.minQty}
                            onClick={() => setQuantity(tier.minQty)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                quantity >= tier.minQty
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-muted border-border hover:border-primary/50"
                            )}
                        >
                            {tier.minQty}+ {tier.discount > 0 && `(-${tier.discount}%)`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unit Price:</span>
                    <span className="font-medium">
                        {currency}{discountedPrice.toFixed(2)}
                        {activeDiscount > 0 && (
                            <span className="text-xs text-muted-foreground line-through ml-1">
                                {currency}{basePrice.toFixed(2)}
                            </span>
                        )}
                    </span>
                </div>

                {activeDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                            <Percent className="w-3 h-3" /> Discount:
                        </span>
                        <span className="font-bold">-{activeDiscount}%</span>
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Package className="w-3 h-3" /> Quantity:
                    </span>
                    <span className="font-medium">{quantity.toLocaleString()} units</span>
                </div>

                <div className="flex justify-between text-lg font-black pt-2 border-t border-border">
                    <span>Total:</span>
                    <span className="text-primary">{currency}{totalPrice.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold py-2 rounded-lg"
                    >
                        <TrendingDown className="w-3 h-3" />
                        You save {currency}{savings.toLocaleString()}!
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
