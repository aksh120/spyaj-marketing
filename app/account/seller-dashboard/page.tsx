"use client";

import { motion } from "framer-motion";
import {
    Eye,
    MessageCircle,
    DollarSign,
    Package,
    TrendingUp,
    Star,
    ChevronRight,
    BarChart3
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { StatsCard, SimpleBarChart, SimpleLineChart, ProgressBar } from "@/components/dashboard/DashboardComponents";

const mockProducts = [
    { id: 1, name: "Premium Cotton Yarn", views: 1250, inquiries: 45, revenue: "₹2.5L", image: "https://loremflickr.com/200/200/yarn" },
    { id: 2, name: "Industrial Steel Pipes", views: 980, inquiries: 32, revenue: "₹4.2L", image: "https://loremflickr.com/200/200/pipes" },
    { id: 3, name: "LED Light Panels", views: 750, inquiries: 28, revenue: "₹1.8L", image: "https://loremflickr.com/200/200/led" },
];

const mockInquiries = [
    { id: 1, buyer: "ABC Trading Co.", product: "Cotton Yarn", time: "2 hours ago", status: "new" },
    { id: 2, buyer: "XYZ Industries", product: "Steel Pipes", time: "5 hours ago", status: "replied" },
    { id: 3, buyer: "Global Imports", product: "LED Panels", time: "1 day ago", status: "quoted" },
];

export default function SellerDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-[100px]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-black mb-2">Seller Dashboard</h1>
                <p className="text-muted-foreground">Monitor your store performance and manage inquiries.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Product Views"
                    value="12.5K"
                    change={18}
                    icon={<Eye className="w-5 h-5" />}
                />
                <StatsCard
                    title="Total Inquiries"
                    value="156"
                    change={24}
                    icon={<MessageCircle className="w-5 h-5" />}
                />
                <StatsCard
                    title="Revenue"
                    value="₹8.5L"
                    change={15}
                    icon={<DollarSign className="w-5 h-5" />}
                />
                <StatsCard
                    title="Conversion Rate"
                    value="4.2%"
                    change={-3}
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-card border-2 border-border rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Views & Inquiries
                        </h2>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded-full" /> Views</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full" /> Inquiries</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Daily Views</p>
                            <SimpleLineChart
                                data={[120, 150, 130, 180, 200, 175, 220, 190, 250, 230, 280, 260]}
                                height={100}
                                color="primary"
                            />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-2">Daily Inquiries</p>
                            <SimpleBarChart
                                data={[5, 8, 6, 12, 10, 8, 15, 11, 18, 14, 20, 16]}
                                height={100}
                                color="green"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border-2 border-border rounded-xl p-4"
                >
                    <h2 className="font-bold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        Performance
                    </h2>
                    <div className="space-y-4">
                        <ProgressBar value={85} label="Response Rate" color="green" />
                        <ProgressBar value={92} label="Delivery Success" color="blue" />
                        <ProgressBar value={78} label="Customer Satisfaction" color="orange" />
                        <ProgressBar value={65} label="Repeat Buyers" color="primary" />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border-2 border-border rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Top Products
                        </h2>
                        <Link href="/account/products" className="text-xs text-primary font-medium flex items-center gap-1">
                            Manage <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {mockProducts.map((product, idx) => (
                            <div key={product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <span className="text-lg font-black text-muted-foreground w-6">#{idx + 1}</span>
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.views.toLocaleString()} views • {product.inquiries} inquiries
                                    </p>
                                </div>
                                <span className="font-bold text-sm text-green-600">{product.revenue}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border-2 border-border rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            Recent Inquiries
                        </h2>
                        <Link href="/account/inquiries" className="text-xs text-primary font-medium flex items-center gap-1">
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {mockInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="font-bold text-sm">{inquiry.buyer}</p>
                                    <p className="text-xs text-muted-foreground">{inquiry.product} • {inquiry.time}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${inquiry.status === "new" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                                        inquiry.status === "replied" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                            "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                    }`}>
                                    {inquiry.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
