"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BarChart3, Package, Users, Briefcase, Bell, Settings, TrendingUp, Clock, MessageSquare, ShoppingCart, Eye, Heart, ChevronRight, Plus, Filter, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const stats = [
    { title: "Total Inquiries", value: "45", trend: "+12%", trendUp: true, icon: <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />, color: "text-blue-500 bg-blue-500/10" },
    { title: "Active Listings", value: "12", trend: "0%", trendUp: true, icon: <Package className="w-5 h-5 md:w-6 md:h-6" />, color: "text-yellow-500 bg-yellow-500/10" },
    { title: "Profile Views", value: "1,240", trend: "+5.4%", trendUp: true, icon: <Eye className="w-5 h-5 md:w-6 md:h-6" />, color: "text-green-500 bg-green-500/10" },
    { title: "Saved Sellers", value: "8", trend: "+2", trendUp: true, icon: <Heart className="w-5 h-5 md:w-6 md:h-6" />, color: "text-pink-500 bg-pink-500/10" },
];

const recentActivity = [
    { title: "Inquiry received for 'Steel Pipes'", time: "2 hours ago", status: "New", statusColor: "bg-blue-500", icon: <MessageSquare className="w-4 h-4" /> },
    { title: "Listing 'Solar Panels' updated", time: "5 hours ago", status: "Updated", statusColor: "bg-green-500", icon: <Package className="w-4 h-4" /> },
    { title: "Message from 'EcoEnergy Systems'", time: "1 day ago", status: "Unread", statusColor: "bg-orange-500", icon: <MessageSquare className="w-4 h-4" /> },
    { title: "New follower: Metro Industries", time: "2 days ago", status: "New", statusColor: "bg-pink-500", icon: <Users className="w-4 h-4" /> },
    { title: "Quote request for bulk order", time: "3 days ago", status: "Pending", statusColor: "bg-yellow-500", icon: <ShoppingCart className="w-4 h-4" /> },
];

const quickLinks = [
    { label: "List New product", icon: <Plus className="w-4 h-4" />, href: "/marketplace" },
    { label: "Verification Center", icon: <Star className="w-4 h-4" />, href: "/seller" },
    { label: "Browse Categories", icon: <Filter className="w-4 h-4" />, href: "/marketplace" },
    { label: "Support Tickets", icon: <MessageSquare className="w-4 h-4" />, href: "/contact" },
];

const notifications = [
    { id: 1, title: "New inquiry from Rahul Industries", time: "10 min ago", read: false },
    { id: 2, title: "Your listing was approved", time: "1 hour ago", read: false },
    { id: 3, title: "Weekly analytics report ready", time: "3 hours ago", read: true },
];

export default function Dashboard() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [activeTab, setActiveTab] = useState<"activity" | "analytics">("activity");

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 pt-[80px] md:pt-[100px]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8"
            >
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl md:text-4xl font-bold mb-1 md:mb-2"
                    >
                        Welcome back, John! 👋
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm md:text-base text-muted-foreground"
                    >
                        Here's what's happening with your account today.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 md:gap-3"
                >
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 md:p-3 bg-card border-2 border-border rounded-lg md:rounded-xl hover:bg-muted hover:border-primary/30 transition-all relative"
                        >
                            <Bell className="w-4 h-4 md:w-5 md:h-5" />
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-background"
                            />
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-card border-2 border-border rounded-xl shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="p-3 border-b border-border">
                                        <h4 className="font-bold text-sm">Notifications</h4>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notif, idx) => (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={cn(
                                                    "p-3 border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors",
                                                    !notif.read && "bg-primary/5"
                                                )}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {!notif.read && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{notif.title}</p>
                                                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="p-2 border-t border-border">
                                        <button className="w-full text-center text-xs font-semibold text-primary hover:underline py-1">
                                            View all notifications
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 md:p-3 bg-card border-2 border-border rounded-lg md:rounded-xl hover:bg-muted hover:border-primary/30 transition-all"
                    >
                        <Settings className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-primary/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className={cn("p-2 md:p-3 rounded-lg md:rounded-xl", stat.color)}
                            >
                                {stat.icon}
                            </motion.div>
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                className={cn(
                                    "text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full flex items-center gap-0.5",
                                    stat.trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}
                            >
                                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </motion.span>
                        </div>
                        <h4 className="text-muted-foreground text-xs md:text-sm font-medium mb-0.5 md:mb-1">{stat.title}</h4>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                            className="text-xl md:text-3xl font-bold"
                        >
                            {stat.value}
                        </motion.p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit"
                    >
                        {(["activity", "analytics"] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all",
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
                        {activeTab === "activity" && (
                            <motion.div
                                key="activity"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-card border-2 border-border rounded-2xl md:rounded-3xl p-5 md:p-8"
                            >
                                <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Recent Activity
                                </h3>
                                <div className="space-y-1 md:space-y-2">
                                    {recentActivity.map((activity, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ x: 5, backgroundColor: "rgba(var(--primary), 0.05)" }}
                                            className="flex items-center justify-between py-3 md:py-4 px-3 md:px-4 rounded-lg md:rounded-xl transition-all cursor-pointer border border-transparent hover:border-border"
                                        >
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className={cn("p-2 rounded-lg", activity.statusColor.replace("bg-", "bg-") + "/10")}
                                                >
                                                    <span className={activity.statusColor.replace("bg-", "text-")}>
                                                        {activity.icon}
                                                    </span>
                                                </motion.div>
                                                <div>
                                                    <p className="font-semibold text-xs md:text-sm">{activity.title}</p>
                                                    <p className="text-[10px] md:text-xs text-muted-foreground">{activity.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    activity.statusColor + "/20 " + activity.statusColor.replace("bg-", "text-")
                                                )}>
                                                    {activity.status}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 md:mt-6 py-2.5 md:py-3 border-2 border-dashed border-border rounded-xl text-xs md:text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                                >
                                    View All Activity
                                </motion.button>
                            </motion.div>
                        )}

                        {activeTab === "analytics" && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-card border-2 border-border rounded-2xl md:rounded-3xl p-5 md:p-8"
                            >
                                <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Analytics Overview
                                </h3>
                                <div className="h-48 md:h-64 bg-muted/30 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">Analytics charts coming soon</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                                    {[
                                        { label: "Views Today", value: "124", change: "+18%" },
                                        { label: "Inquiries", value: "8", change: "+3%" },
                                        { label: "Conversion", value: "6.4%", change: "+0.8%" },
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="text-center p-3 bg-muted/30 rounded-xl"
                                        >
                                            <p className="text-lg md:text-2xl font-bold">{item.value}</p>
                                            <p className="text-[10px] md:text-xs text-muted-foreground">{item.label}</p>
                                            <span className="text-[10px] text-green-500 font-bold">{item.change}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(var(--primary), 0.2)" }}
                        className="bg-gradient-to-br from-primary via-primary to-primary/80 p-5 md:p-8 rounded-2xl md:rounded-3xl text-primary-foreground relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                        </div>
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4"
                            >
                                <Star className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                            <h3 className="font-bold text-base md:text-xl mb-1 md:mb-2">Pro Plan Active</h3>
                            <p className="opacity-80 text-xs md:text-sm mb-4 md:mb-6">Enjoy unlimited listings and priority support.</p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full bg-white text-primary py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm shadow-lg"
                            >
                                Manage Billing
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-card border-2 border-border rounded-2xl md:rounded-3xl p-4 md:p-6"
                    >
                        <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
                        </h4>
                        <div className="space-y-1 md:space-y-2">
                            {quickLinks.map((link, idx) => (
                                <motion.div key={idx} whileHover={{ x: 5 }}>
                                    <Link
                                        href={link.href}
                                        className="w-full text-left px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm hover:bg-muted transition-colors flex items-center justify-between group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-muted-foreground group-hover:text-primary transition-colors">{link.icon}</span>
                                            {link.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                        className="bg-muted/30 border-2 border-border rounded-2xl md:rounded-3xl p-4 md:p-6 text-center"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                        >
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </motion.div>
                        <h4 className="font-bold text-sm mb-1">Need Help?</h4>
                        <p className="text-xs text-muted-foreground mb-3">Our support team is here for you 24/7</p>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full border-2 border-primary text-primary py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                Contact Support
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
