"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, X, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SampleRequestButtonProps {
    productName: string;
    sellerName: string;
    className?: string;
}

export default function SampleRequestButton({
    productName,
    sellerName,
    className,
}: SampleRequestButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        quantity: "1",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsOpen(false);
            setIsSuccess(false);
            setFormData({ name: "", email: "", phone: "", address: "", quantity: "1", notes: "" });
        }, 2000);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-all text-sm",
                    className
                )}
            >
                <Package className="w-4 h-4" />
                Request Sample
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">Request Sample</h3>
                                        <p className="text-xs text-white/70">{productName}</p>
                                    </div>
                                    <button
                                        onClick={() => !isSubmitting && setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.1 }}
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    </motion.div>
                                    <h4 className="font-bold text-lg mb-1">Request Submitted!</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {sellerName} will contact you shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-white dark:bg-zinc-900">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Phone *</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Shipping Address *</label>
                                        <textarea
                                            required
                                            rows={2}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Sample Qty</label>
                                            <select
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="1">1 piece</option>
                                                <option value="2">2 pieces</option>
                                                <option value="5">5 pieces</option>
                                                <option value="10">10 pieces</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                                            <input
                                                type="text"
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                placeholder="Optional"
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
