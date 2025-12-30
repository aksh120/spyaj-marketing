"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Star, MapPin, Globe, MessageSquare, Package, ShieldCheck, Mail, Phone, TrendingUp, Users, Award, Clock, Send, Heart, Eye, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sellerData = {
    name: "Global Metals Co.",
    tagline: "Premier Supplier of Industrial Steel and Components",
    location: "Pune, Maharashtra, India",
    website: "www.globalmetals.com",
    joined: "2020",
    verified: true,
    rating: 4.8,
    reviews: 1250,
    products_count: 540,
    responseRate: 98,
    responseTime: "< 2 hours",
    description: "Global Metals Co. has been a cornerstone of the industrial supply chain for over a decade. We specialize in high-grade steel, precision components, and sustainable manufacturing solutions for the global market. Our commitment to quality and customer satisfaction has made us a trusted partner for businesses worldwide.",
    certifications: ["ISO 9001:2015", "CE Certified", "BIS Approved"],
};

const sellerProducts = [
    { id: 1, name: "Industrial Grade Steel Pipes", price: "₹1,200", image: "Pipes", rating: 4.9, orders: 1560, minOrder: "100 pcs", badge: "Best Seller" },
    { id: 2, name: "Galvanized Steel Coils", price: "₹3,500", image: "Coils", rating: 4.8, orders: 890, minOrder: "50 tons", badge: null },
    { id: 3, name: "Precision CNC Machined Parts", price: "₹85", image: "Parts", rating: 4.7, orders: 2340, minOrder: "500 pcs", badge: "Hot" },
    { id: 4, name: "Stainless Steel Fasteners", price: "₹45", image: "Fasteners", rating: 4.6, orders: 5600, minOrder: "1000 pcs", badge: null },
    { id: 5, name: "Steel Reinforcement Bars", price: "₹650", image: "Rebars", rating: 4.8, orders: 780, minOrder: "10 tons", badge: "New" },
    { id: 6, name: "Metal Fabrication Services", price: "Custom", image: "Fabrication", rating: 4.9, orders: 120, minOrder: "1 project", badge: null },
];

const stats = [
    { label: "Products", value: sellerData.products_count.toString(), icon: <Package className="w-4 h-4" />, color: "text-blue-500" },
    { label: "Response Rate", value: "98%", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-500" },
    { label: "Delivery Rate", value: "150+", icon: <Users className="w-4 h-4" />, color: "text-yellow-500" },
    { label: "Years on Site", value: "4+", icon: <Award className="w-4 h-4" />, color: "text-orange-500" },
];

const reviews = [
    { id: 1, user: "Rahul Industries", rating: 5, comment: "Excellent quality steel pipes. Delivery was on time.", date: "2 days ago" },
    { id: 2, user: "Metro Constructions", rating: 4, comment: "Good products, competitive pricing. Will order again.", date: "1 week ago" },
    { id: 3, user: "Prime Engineering", rating: 5, comment: "Best supplier we've worked with. Highly recommended!", date: "2 weeks ago" },
];

export default function SellerPage() {
    const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">("products");
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 pt-[80px] md:pt-[100px]">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card border-2 border-border rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-8 shadow-lg relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-6xl font-bold text-primary border-4 border-primary/20 shadow-xl relative"
                    >
                        GM
                        {sellerData.verified && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-full border-4 border-card"
                            >
                                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-2"
                        >
                            <h1 className="text-xl md:text-3xl font-bold">{sellerData.name}</h1>
                            {sellerData.verified && (
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-blue-500/10 text-blue-500 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5 border border-blue-500/20"
                                >
                                    <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" /> Verified Supplier
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm md:text-lg text-muted-foreground mb-3 md:mb-4"
                        >
                            {sellerData.tagline}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-6"
                        >
                            <InfoPill icon={<MapPin className="w-3 h-3 md:w-4 md:h-4" />} label={sellerData.location} />
                            <InfoPill icon={<Globe className="w-3 h-3 md:w-4 md:h-4" />} label={sellerData.website} />
                            <InfoPill icon={<Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />} label={`${sellerData.rating} (${sellerData.reviews} reviews)`} />
                            <InfoPill icon={<Clock className="w-3 h-3 md:w-4 md:h-4" />} label={`Response: ${sellerData.responseTime}`} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 justify-center md:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(var(--primary)/0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-primary text-primary-foreground border-2 border-primary px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <MessageSquare className="w-4 h-4" /> Message Seller
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="border-2 border-border px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-muted hover:border-primary/50 transition-all"
                            >
                                <Mail className="w-4 h-4" /> Request Quote
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={cn(
                                    "p-2 md:p-3 rounded-lg md:rounded-xl border-2 transition-all",
                                    isFollowing ? "bg-pink-500 border-pink-500 text-white" : "border-border hover:bg-muted"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isFollowing && "fill-current")} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 md:p-3 rounded-lg md:rounded-xl border-2 border-border hover:bg-muted transition-all"
                            >
                                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                        className="bg-card border-2 border-border rounded-lg md:rounded-xl p-3 md:p-5 text-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className={cn("mx-auto mb-2", stat.color)}
                        >
                            {stat.icon}
                        </motion.div>
                        <div className="text-lg md:text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-[9px] md:text-[11px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-1 md:gap-2 mb-6 md:mb-8 bg-muted/50 p-1 rounded-xl"
            >
                {(["products", "about", "reviews"] as const).map((tab) => (
                    <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "flex-1 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold capitalize transition-all",
                            activeTab === tab
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab}
                    </motion.button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === "products" && (
                    <motion.div
                        key="products"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 md:w-6 md:h-6 text-primary" /> Products ({sellerProducts.length})
                            </h3>
                            <Link href="/marketplace" className="text-xs md:text-sm font-semibold text-primary hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {sellerProducts.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    className="group bg-card border-2 border-border rounded-xl md:rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-primary/5 via-muted/30 to-primary/10 flex items-center justify-center text-muted-foreground/30 text-xs md:text-base font-bold uppercase italic tracking-widest border-b-2 border-border relative">
                                        {p.image}
                                        {p.badge && (
                                            <motion.div
                                                initial={{ x: -50 }}
                                                animate={{ x: 0 }}
                                                className={cn(
                                                    "absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold uppercase",
                                                    p.badge === "Best Seller" && "bg-orange-500 text-white",
                                                    p.badge === "Hot" && "bg-red-500 text-white",
                                                    p.badge === "New" && "bg-green-500 text-white",
                                                )}
                                            >
                                                {p.badge}
                                            </motion.div>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full">
                                                <Eye className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full">
                                                <Heart className="w-4 h-4" />
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                    <div className="p-3 md:p-4">
                                        <h4 className="font-bold text-xs md:text-base mb-1 md:mb-2 truncate group-hover:text-primary transition-colors">{p.name}</h4>
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] md:text-xs text-muted-foreground">{p.rating} • {p.orders} orders</span>
                                        </div>
                                        <div className="text-[10px] md:text-xs text-muted-foreground mb-2">Min. Order: {p.minOrder}</div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <span className="text-lg md:text-2xl font-bold text-primary">{p.price}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-[10px] md:text-xs font-bold bg-primary text-primary-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg shadow-primary/20"
                                            >
                                                Inquire
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === "about" && (
                    <motion.div
                        key="about"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
                    >
                        <div className="space-y-6">
                            <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6">
                                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">About Us</h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {sellerData.description}
                                </p>
                            </div>

                            <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6">
                                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Certifications</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sellerData.certifications.map((cert) => (
                                        <motion.div
                                            key={cert}
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                                            {cert}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border-2 border-border rounded-2xl p-5 md:p-6">
                            <h3 className="text-lg md:text-xl font-bold mb-4">Trust & Safety</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "On-site Verification", desc: "Our team has verified this supplier's location" },
                                    { label: "Product Quality Certified", desc: "Products meet international quality standards" },
                                    { label: "Trade Assurance", desc: "Your payment is protected by escrow" },
                                    { label: "Secure Transaction", desc: "SSL encrypted payment processing" },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <motion.div whileHover={{ scale: 1.2 }}>
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-sm md:text-base">{item.label}</p>
                                            <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "reviews" && (
                    <motion.div
                        key="reviews"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary">{sellerData.rating}</div>
                                <div className="flex items-center justify-center gap-0.5 my-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < Math.floor(sellerData.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300")} />
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground">{sellerData.reviews} reviews</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {reviews.map((review, idx) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-card border-2 border-border rounded-xl p-4 md:p-5"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{review.user}</p>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300")} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{review.date}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoPill({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground font-medium bg-muted/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full"
        >
            {icon}
            {label}
        </motion.div>
    );
}
