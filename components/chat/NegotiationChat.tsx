"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    Send,
    IndianRupee,
    Check,
    X,
    ChevronDown,
    ArrowRight,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Offer {
    id: number;
    type: "sent" | "received";
    amount: number;
    currency: string;
    quantity: number;
    status: "pending" | "accepted" | "rejected" | "countered";
    timestamp: Date;
    message?: string;
}

interface NegotiationChatProps {
    productName: string;
    sellerName: string;
    basePrice: number;
    currency?: string;
    className?: string;
}

export default function NegotiationChat({
    productName,
    sellerName,
    basePrice,
    currency = "₹",
    className,
}: NegotiationChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [offers, setOffers] = useState<Offer[]>([
        {
            id: 1,
            type: "received",
            amount: basePrice,
            currency,
            quantity: 100,
            status: "pending",
            timestamp: new Date(Date.now() - 3600000),
            message: "Listed price for 100 units",
        },
    ]);
    const [newOffer, setNewOffer] = useState({
        amount: Math.floor(basePrice * 0.9),
        quantity: 100,
        message: "",
    });

    const handleSendOffer = () => {
        if (newOffer.amount <= 0) return;

        const offer: Offer = {
            id: Date.now(),
            type: "sent",
            amount: newOffer.amount,
            currency,
            quantity: newOffer.quantity,
            status: "pending",
            timestamp: new Date(),
            message: newOffer.message || `Offer for ${newOffer.quantity} units`,
        };

        setOffers([...offers, offer]);
        setNewOffer({ amount: Math.floor(newOffer.amount * 0.95), quantity: newOffer.quantity, message: "" });

        setTimeout(() => {
            const response: Offer = {
                id: Date.now() + 1,
                type: "received",
                amount: Math.floor((offer.amount + basePrice) / 2),
                currency,
                quantity: offer.quantity,
                status: "countered",
                timestamp: new Date(),
                message: "Counter offer",
            };
            setOffers((prev) => [...prev, response]);
        }, 2000);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700 transition-all text-sm shadow-lg",
                    className
                )}
            >
                <IndianRupee className="w-4 h-4" />
                Negotiate Price
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">Price Negotiation</h3>
                                        <p className="text-xs text-white/70">{productName} • {sellerName}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 dark:bg-zinc-800">
                                {offers.map((offer) => (
                                    <motion.div
                                        key={offer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "max-w-[80%] p-3 rounded-xl",
                                            offer.type === "sent"
                                                ? "ml-auto bg-primary text-primary-foreground"
                                                : "bg-background border border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs opacity-70">
                                                {offer.type === "sent" ? "Your Offer" : sellerName}
                                            </span>
                                            {offer.status === "countered" && (
                                                <span className="text-[10px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded font-bold">
                                                    Counter
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-black">
                                                {offer.currency}{offer.amount.toLocaleString()}
                                            </span>
                                            <span className="text-xs opacity-70">/ unit</span>
                                        </div>
                                        <p className="text-xs opacity-70 mt-1">{offer.message}</p>
                                        <p className="text-[10px] opacity-50 mt-2">
                                            {offer.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Your Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                value={newOffer.amount}
                                                onChange={(e) => setNewOffer({ ...newOffer, amount: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                                        <input
                                            type="number"
                                            value={newOffer.quantity}
                                            onChange={(e) => setNewOffer({ ...newOffer, quantity: parseInt(e.target.value) || 100 })}
                                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newOffer.message}
                                        onChange={(e) => setNewOffer({ ...newOffer, message: e.target.value })}
                                        placeholder="Add a message (optional)"
                                        className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-primary transition-colors"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSendOffer}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
                                    </motion.button>
                                </div>

                                <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground text-center">
                                        Total: <span className="font-bold text-foreground">{currency}{(newOffer.amount * newOffer.quantity).toLocaleString()}</span> for {newOffer.quantity} units
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
