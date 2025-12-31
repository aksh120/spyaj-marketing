"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Star,
    ShieldCheck,
    MapPin,
    MessageCircle,
    FileText,
    Truck,
    Package,
    Info,
    ChevronRight,
    CheckCircle2,
    Share2,
    Heart,
    Download,
    Clock,
    Globe,
    Award,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";

interface ProductDetailsClientProps {
    product: any;
    seller: any;
}

export default function ProductDetailsClient({
    product,
    seller,
}: ProductDetailsClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(100);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const images = Array(5)
        .fill(product.image)
        .map((img, i) =>
            i === 0
                ? img
                : `https://loremflickr.com/500/500/${product.category || "product"}?random=${i}`,
        );

    const tabs = [
        { id: "overview", label: "Product Overview" },
        { id: "specs", label: "Specifications" },
        { id: "company", label: "Company Profile" },
        { id: "reviews", label: "Reviews & Ratings" },
    ];

    return (
        <div className="min-h-screen pt-[80px] md:pt-[120px] pb-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 mb-6">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <Link
                        href="/marketplace"
                        className="hover:text-primary transition-colors"
                    >
                        Marketplace
                    </Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <Link
                        href={`/marketplace?category=${slugify(product.category || "All")}`}
                        className="hover:text-primary transition-colors"
                    >
                        {product.category || "All Products"}
                    </Link>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="font-medium text-foreground">{product.name}</span>
                </nav>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                            selectedImage === idx
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-transparent hover:border-gray-200",
                                        )}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 relative aspect-square md:aspect-[4/3] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden group">
                                <Image
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                                {product.badge && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        {product.badge}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className="p-2.5 bg-white dark:bg-black/50 backdrop-blur rounded-full text-foreground hover:text-red-500 transition-colors shadow-sm"
                                    >
                                        <Heart
                                            className={cn(
                                                "w-5 h-5",
                                                isWishlisted && "fill-red-500 text-red-500",
                                            )}
                                        />
                                    </button>
                                    <button className="p-2.5 bg-white dark:bg-black/50 backdrop-blur rounded-full text-foreground hover:text-primary transition-colors shadow-sm">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative w-16 aspect-square rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                                            selectedImage === idx
                                                ? "border-primary"
                                                : "border-transparent",
                                        )}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                        <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-6 md:px-8 py-4 text-sm md:text-base font-bold border-b-2 whitespace-nowrap transition-all",
                                        activeTab === tab.id
                                            ? "border-primary text-primary bg-primary/5"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 md:p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === "overview" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">
                                                Product Description
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                                High-quality {product.name.toLowerCase()} designed for
                                                industrial and commercial applications. Manufactured
                                                using premium grade materials ensuring durability and
                                                long-lasting performance. Ideally suited for{" "}
                                                {product.category} sector needs. Our products undergo
                                                rigorous quality control checks to meet international
                                                standards.
                                            </p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                                    <Award className="w-5 h-5 text-orange-500" /> Key
                                                    Features
                                                </h4>
                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                                                        Premium material composition
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                                                        High efficiency & durability
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                                                        Certified ISO 9001:2015
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                                                        1 Year Manufacturer Warranty
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-blue-500" />{" "}
                                                    Packaging
                                                </h4>
                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                                                        Export quality packing
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                                                        Customized options available
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />{" "}
                                                        Safe transit assurance
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "specs" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="rounded-xl border border-border overflow-hidden">
                                            {[
                                                {
                                                    label: "Model Number",
                                                    value: `SP-${product.id}-2024`,
                                                },
                                                { label: "Material / Type", value: product.category },
                                                {
                                                    label: "Origin",
                                                    value: seller.location.split(",")[1] || "India",
                                                },
                                                { label: "Brand", value: seller.name },
                                                { label: "Minimum Order Qty", value: "50 Units" },
                                                {
                                                    label: "Production Capacity",
                                                    value: "10,000 Units / Month",
                                                },
                                                {
                                                    label: "Payment Terms",
                                                    value: "L/C, T/T, Western Union",
                                                },
                                                { label: "Lead Time", value: "15 Days" },
                                            ].map((row, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "grid grid-cols-2 md:grid-cols-3 p-4",
                                                        i % 2 === 0 ? "bg-muted/30" : "bg-card",
                                                    )}
                                                >
                                                    <div className="text-muted-foreground font-medium text-sm md:col-span-1">
                                                        {row.label}
                                                    </div>
                                                    <div className="font-semibold text-sm md:col-span-2">
                                                        {row.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "company" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-xl relative overflow-hidden border border-border">
                                                <Image
                                                    src={seller.logo}
                                                    alt={seller.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">
                                                    {seller.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span
                                                        className={cn(
                                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                                            seller.tier === "Gold"
                                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                : "bg-gray-100 text-gray-700 border-gray-200",
                                                        )}
                                                    >
                                                        {seller.tier} Supplier
                                                    </span>
                                                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {seller.location}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">
                                                    {seller.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: "Founded", value: seller.joined },
                                                { label: "Response Rate", value: seller.responseRate },
                                                { label: "Employees", value: "51-100" },
                                                { label: "Total Revenue", value: "US$ 1M - 2.5M" },
                                            ].map((stat, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-muted/30 p-4 rounded-xl text-center border border-border/50"
                                                >
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                                        {stat.label}
                                                    </div>
                                                    <div className="font-bold text-foreground">
                                                        {stat.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "reviews" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="flex items-center gap-6 mb-8 bg-muted/30 p-6 rounded-2xl border border-border/50">
                                            <div className="text-center">
                                                <div className="text-5xl font-black text-primary">
                                                    {product.rating}
                                                </div>
                                                <div className="flex items-center justify-center gap-1 my-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "w-4 h-4",
                                                                i < Math.floor(product.rating)
                                                                    ? "text-yellow-500 fill-yellow-500"
                                                                    : "text-gray-300",
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-sm text-muted-foreground font-medium">
                                                    {product.reviews || 120} Verified Reviews
                                                </div>
                                            </div>
                                            <div className="flex-1 hidden md:block border-l border-border pl-6">
                                                <p className="text-muted-foreground italic">
                                                    "One of the best suppliers we have worked with.
                                                    Quality is consistent and delivery is always on time."
                                                </p>
                                                <div className="mt-2 font-bold text-sm">
                                                    - Verified Buyer, USA
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-[100px] space-y-6">
                        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <h1 className="text-2xl font-bold mb-2 line-clamp-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> In Stock
                                </span>
                                <span className="text-muted-foreground text-xs">
                                    {product.orders || 0} orders
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="text-sm text-muted-foreground mb-1">
                                    Unit Price
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="text-4xl font-black text-primary">
                                        {product.price}
                                    </div>
                                    {product.oldPrice && (
                                        <div className="text-lg text-muted-foreground line-through mb-1.5">
                                            {product.oldPrice}
                                        </div>
                                    )}
                                </div>
                                {product.discount && (
                                    <div className="text-sm font-bold text-red-600 mt-1">
                                        Save {product.discount} today
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">
                                    Quantity (Units)
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border-2 border-border rounded-lg bg-background">
                                        <button
                                            onClick={() => setQty(Math.max(1, qty - 10))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-l-md transition-colors font-bold text-lg"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            className="w-20 text-center bg-transparent outline-none font-bold"
                                        />
                                        <button
                                            onClick={() => setQty(qty + 10)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-r-md transition-colors font-bold text-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Total:{" "}
                                        <span className="font-bold text-foreground">
                                            ₹
                                            {(
                                                parseInt(product.price.replace(/[^0-9]/g, "")) * qty
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:scale-[1.02] transform transition-all flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" /> Send Inquiry
                                </button>
                                <button className="w-full bg-white dark:bg-card border-2 border-primary text-primary py-3.5 rounded-xl font-bold text-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                                    <MessageCircle className="w-5 h-5" /> Chat with Seller
                                </button>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full border border-border p-0.5 relative">
                                    <Image
                                        src={seller.logo}
                                        alt={seller.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <div className="font-bold text-sm leading-tight mb-0.5">
                                        {seller.name}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <ShieldCheck className="w-3 h-3 text-blue-500" />{" "}
                                        {seller.tier} Member
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                                <div className="bg-muted/50 p-2 rounded text-center">
                                    <div className="text-muted-foreground mb-0.5">
                                        Response Time
                                    </div>
                                    <div className="font-bold">{seller.responseTime}</div>
                                </div>
                                <div className="bg-muted/50 p-2 rounded text-center">
                                    <div className="text-muted-foreground mb-0.5">
                                        On-time Delivery
                                    </div>
                                    <div className="font-bold text-green-600">
                                        {seller.deliverySuccess}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/seller/${seller.id}`}
                                className="block w-full text-center py-2 text-sm font-bold text-primary hover:underline"
                            >
                                View Company Profile
                            </Link>
                        </div>

                        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 flex gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base text-foreground mb-1">
                                    Trade Assurance
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Protects your orders from payment to delivery. Full refund if
                                    product not as described.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
