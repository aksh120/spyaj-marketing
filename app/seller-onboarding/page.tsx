"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SellerOnboarding() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px] text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Start Selling to Millions</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                Expand your business reach with SPYAJ Marketing. Join thousands of successful suppliers.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                {["Access 50k+ Buyers", "0% Commission for 3 Months", "Dedicated Support"].map((benefit, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        <span className="font-bold">{benefit}</span>
                    </motion.div>
                ))}
            </div>

            <Link href="/auth/sign-up">
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Join as a Seller Now
                </button>
            </Link>
        </div>
    );
}
