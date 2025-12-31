"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  HeartPulse,
  Shirt,
  Beaker,
  Settings,
  Building2,
  Cpu,
  Stethoscope,
  Gift,
  Package,
  Sprout,
  Home as HomeIcon,
  Gem,
  Factory,
  Cog,
  ShieldCheck,
  Globe,
  Headphones,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Flame,
  Zap,
  Star,
  Heart,
  ShoppingBag,
  FileQuestion,
  Lock,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { discountProducts, flashDeals, featuredProducts } from "@/lib/data";
import RecentlyViewed from "@/components/product/RecentlyViewed";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const sideCategories = [
  { name: "Health & Beauty", icon: <HeartPulse className="w-4 h-4" /> },
  { name: "Apparel & Fashion", icon: <Shirt className="w-4 h-4" /> },
  { name: "Chemicals", icon: <Beaker className="w-4 h-4" /> },
  { name: "Machinery", icon: <Settings className="w-4 h-4" /> },
  {
    name: "Construction & Real Estate",
    icon: <Building2 className="w-4 h-4" />,
  },
  { name: "Electronics & Electricity", icon: <Cpu className="w-4 h-4" /> },
  { name: "Hospital & Medical", icon: <Stethoscope className="w-4 h-4" /> },
  { name: "Gifts & Crafts", icon: <Gift className="w-4 h-4" /> },
  { name: "Packaging & Paper", icon: <Package className="w-4 h-4" /> },
  { name: "Agriculture", icon: <Sprout className="w-4 h-4" /> },
  { name: "Home Supplies", icon: <HomeIcon className="w-4 h-4" /> },
  { name: "Mineral & Metals", icon: <Gem className="w-4 h-4" /> },
  { name: "Industrial Supplies", icon: <Factory className="w-4 h-4" /> },
  { name: "Pipes, Tubes & Fittings", icon: <Cog className="w-4 h-4" /> },
];

const carouselSlides = [
  {
    title: "Direct from Manufacturers",
    subtitle: "Connect with global sellers directly for best pricing.",
    color: "from-blue-900 via-blue-700 to-yellow-600",
    badge: "New",
    icon: <Factory className="w-full h-full" />,
  },
  {
    title: "Smart Sourcing Solutions",
    subtitle: "Find the best raw materials for your production.",
    color: "from-emerald-900 via-green-800 to-teal-600",
    badge: "Popular",
    icon: <Sprout className="w-full h-full" />,
  },
  {
    title: "Global Logistics Network",
    subtitle: "Reliable shipping to over 200 countries worldwide.",
    color: "from-orange-800 via-red-800 to-red-600",
    badge: "Trending",
    icon: <Globe className="w-full h-full" />,
  },
];

const features = [
  {
    text: "Worry-Free Shopping",
    icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />,
    desc: "100% Protection",
  },
  {
    text: "Worldwide Delivery",
    icon: <Globe className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />,
    desc: "200+ Countries",
  },
  {
    text: "24/7 Customer Service",
    icon: <Headphones className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />,
    desc: "Always Available",
  },
  {
    text: "Secure Payment",
    icon: <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />,
    desc: "SSL Encrypted",
  },
];

const categories = [
  {
    name: "Electronics",
    icon: <Cpu className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
    color: "from-blue-500/20 to-blue-600/10",
    count: "2.5K+",
  },
  {
    name: "Fashion",
    icon: <Shirt className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />,
    color: "from-pink-500/20 to-pink-600/10",
    count: "5K+",
  },
  {
    name: "Industrial",
    icon: <Factory className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />,
    color: "from-gray-500/20 to-gray-600/10",
    count: "1.8K+",
  },
  {
    name: "Health",
    icon: <HeartPulse className="w-5 h-5 md:w-6 md:h-6 text-red-500" />,
    color: "from-red-500/20 to-red-600/10",
    count: "3.2K+",
  },
  {
    name: "Agriculture",
    icon: <Sprout className="w-5 h-5 md:w-6 md:h-6 text-green-500" />,
    color: "from-green-500/20 to-green-600/10",
    count: "1.5K+",
  },
];

const infoCards = [
  {
    title: "About SPYAJ",
    icon: <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-primary" />,
    description: "Wholesale products from certified sellers",
    subtext: "Worldwide shipping | Low prices from ₹500",
    link: "Learn More >>",
    href: "/about",
  },
  {
    title: "Buyers FAQ",
    icon: <FileQuestion className="w-10 h-10 md:w-12 md:h-12 text-primary" />,
    description: "How do I contact the seller?",
    subtext: "How do I make a payment? | How do I calculate shipping cost?",
    link: "Learn More >>",
    href: "/buyers-faq",
  },
  {
    title: "Buyer Protection",
    icon: <Lock className="w-10 h-10 md:w-12 md:h-12 text-primary" />,
    description: "Secure payments",
    subtext: "Guaranteed refunds | Escrow protection on every order",
    link: "Learn More >>",
    href: "/buyers-protection",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 32,
    seconds: 45,
  });
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return (
    <main className="min-h-screen pt-[80px] md:pt-[100px] flex flex-col bg-background overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 flex flex-col gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[80px] md:h-[120px] rounded-xl md:rounded-2xl overflow-hidden border-2 border-border shadow-lg group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-yellow-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12">
            <div className="text-white">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-3xl font-black italic tracking-tighter uppercase"
              >
                Connect. Trade. Grow.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5 }}
                className="text-xs md:text-sm opacity-80"
              >
                India's Most Trusted B2B Marketplace
              </motion.p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/marketplace"
                className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-bold hover:bg-white/30 transition-all border border-white/30"
              >
                <Sparkles className="w-4 h-4" />
                Explore Now
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div
          ref={heroRef}
          className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:h-[500px]"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-[300px] flex-shrink-0 bg-card border-2 border-border rounded-xl md:rounded-2xl shadow-md p-3 md:p-4 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden scrollbar-hide"
          >
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 px-2 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Categories
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              className="flex lg:flex-col gap-2 lg:gap-1 lg:space-y-1"
            >
              {sideCategories.map((cat, idx) => (
                <motion.div key={cat.name} variants={staggerItem}>
                  <Link
                    href={`/marketplace?category=${slugify(cat.name)}`}
                    className="flex items-center justify-between p-2 md:p-2.5 rounded-lg md:rounded-xl hover:bg-primary/5 hover:text-primary transition-all group border border-transparent hover:border-primary/10 flex-shrink-0"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      >
                        {cat.icon}
                      </motion.div>
                      <span className="text-xs md:text-sm font-medium tracking-tight whitespace-nowrap">
                        {cat.name}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border-2 border-border group min-h-[250px] md:min-h-[350px] lg:min-h-0"
          >
            <AnimatePresence>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[currentSlide].color} p-6 md:p-12 lg:p-16 flex items-center overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-125 filter contrast-125 mix-blend-overlay"></div>

                <motion.div
                  initial={{ opacity: 0, x: 100, rotate: 20 }}
                  animate={{ opacity: 0.15, x: 0, rotate: -15 }}
                  exit={{ opacity: 0, x: 100, rotate: 20 }}
                  transition={{ duration: 0.8 }}
                  className="absolute -right-20 -bottom-20 md:right-10 md:-bottom-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] text-white pointer-events-none"
                >
                  {carouselSlides[currentSlide].icon}
                </motion.div>

                <div className="relative z-10 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block bg-white/20 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-xs md:text-sm font-bold mb-4 shadow-sm"
                  >
                    ✨ {carouselSlides[currentSlide].badge}
                  </motion.div>
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.1] tracking-tight drop-shadow-sm"
                  >
                    {carouselSlides[currentSlide].title}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-white/90 text-sm md:text-xl lg:text-2xl font-medium max-w-xl mb-6 md:mb-10 drop-shadow-sm leading-relaxed"
                  >
                    {carouselSlides[currentSlide].subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Link href="/marketplace">
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-xl text-sm md:text-lg font-bold shadow-xl hover:bg-gray-50 transition-colors"
                      >
                        Explore Now{" "}
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 md:bottom-6 right-4 md:right-8 flex gap-2 md:gap-3 z-10">
              {carouselSlides.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 md:h-3 rounded-full transition-all ${currentSlide === i ? "bg-white w-6 md:w-8" : "bg-white/30 hover:bg-white/50 w-2 md:w-3"}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-3 md:p-6 shadow-md grid grid-cols-2 md:flex md:items-center md:justify-between gap-3 md:gap-0"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex items-center gap-2 md:gap-4 px-2 md:px-6 md:border-r md:last:border-r-0 border-border/50 group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="transition-transform"
              >
                {feature.icon}
              </motion.div>
              <div>
                <span className="font-bold text-xs md:text-sm lg:text-base tracking-tight group-hover:text-primary transition-colors block">
                  {feature.text}
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground">
                  {feature.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <RecentlyViewed />

        <AnimatedSection className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              </motion.div>
              <h2 className="text-lg md:text-2xl font-black">Price Drop</h2>
              <span className="text-xs md:text-sm font-bold bg-orange-600 text-white dark:bg-orange-100 dark:text-black px-3 py-1 rounded-full shadow-sm">
                Free Shipping | Save Up to ₹5000!
              </span>
            </div>
            <Link
              href="/marketplace"
              className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1 group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4"
          >
            {discountProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDiscount />
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-950/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </motion.div>
              <h2 className="text-lg md:text-2xl font-black text-red-600">
                Flash Deals
              </h2>
              <div className="flex items-center gap-1.5 md:gap-2 bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg">
                <span className="text-xs md:text-sm font-bold">Ends In</span>
                <div className="flex gap-0.5 md:gap-1">
                  <TimeBox value={timeLeft.hours} />
                  <span className="font-bold">:</span>
                  <TimeBox value={timeLeft.minutes} />
                  <span className="font-bold">:</span>
                  <TimeBox value={timeLeft.seconds} />
                </div>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1 group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
          >
            {flashDeals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showDiscount
                showStock
              />
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 h-5 md:w-7 md:h-7 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <h2 className="text-lg md:text-2xl font-black">
                Featured Products
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1 group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {featuredProducts.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 md:w-7 md:h-7 text-pink-500 fill-pink-500" />
              </motion.div>
              <h2 className="text-lg md:text-2xl font-black">You May Like</h2>
            </div>
            <Link
              href="/marketplace"
              className="text-xs md:text-sm font-bold text-primary hover:underline flex items-center gap-1 group"
            >
              View All{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {featuredProducts.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatedSection>

        {categories.map((category, idx) => (
          <CategoryCarousel key={idx} category={category} />
        ))}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-5 md:p-8 text-center hover:border-primary/30 transition-all group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex justify-center mb-3 md:mb-4"
              >
                {card.icon}
              </motion.div>
              <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
                {card.description}
              </p>
              <p className="text-xs text-muted-foreground mb-3 md:mb-4">
                {card.subtext}
              </p>
              <Link
                href={card.href}
                className="text-xs md:text-sm font-bold text-primary hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                {card.link}
              </Link>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </main>
  );
}

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function ProductCard({
  product,
  showDiscount,
  showStock,
}: {
  product: any;
  showDiscount?: boolean;
  showStock?: boolean;
}) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="bg-card border-2 border-border rounded-xl hover:border-primary/50 transition-all group cursor-pointer h-full relative overflow-hidden"
    >
      <Link
        href={`/product/${slugify(product.seller || "Verified Seller")}/${slugify(product.name)}`}
        className="block h-full w-full"
      >
        <div className="p-3 h-full flex flex-col">
          <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {showDiscount && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 left-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded z-20"
              >
                {product.discount}
              </motion.div>
            )}
            {showStock && product.stock && (
              <div className="absolute bottom-2 left-2 right-2 z-20">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(product.stock / 30) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-red-500 h-full rounded-full"
                  />
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5 block">
                  {product.stock} left
                </span>
              </div>
            )}
          </div>
          <h4 className="text-xs font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h4>
          {product.rating && (
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] text-muted-foreground">
                {product.rating} ({product.sold || product.stock} sold)
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1 md:gap-2 mt-auto">
            <span className="text-sm font-bold text-primary">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-5 right-5 p-1.5 bg-white/80 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Heart className="w-3 h-3 text-gray-500" />
      </motion.button>
    </motion.div>
  );
}

function FeaturedProductCard({ product }: { product: any }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="bg-background border-2 border-border rounded-lg md:rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer h-full relative"
    >
      <Link
        href={`/product/${slugify(product.seller || "Verified Seller")}/${slugify(product.name)}`}
        className="block h-full w-full"
      >
        <div className="flex flex-col h-full">
          <div className="aspect-square bg-white flex items-center justify-center border-b-2 border-border relative overflow-hidden">
            <Image
              src={
                product.image || "https://loremflickr.com/500/500/industrial"
              }
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <motion.div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="p-3 md:p-4 flex-1">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"
              />
              <span className="text-[10px] md:text-xs font-bold text-blue-500 uppercase">
                {product.seller}
              </span>
              {product.verified && (
                <ShieldCheck className="w-3 h-3 text-green-500" />
              )}
            </div>
            <h4 className="text-xs md:text-base font-bold mb-1.5 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h4>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] text-muted-foreground">
                {product.rating} • {product.orders} orders
              </span>
            </div>
            <p className="text-sm md:text-xl font-bold text-primary">
              {product.price}
            </p>
          </div>
        </div>
      </Link>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Heart className="w-3 h-3 text-gray-500" />
      </motion.button>
    </motion.div>
  );
}

function CategoryCarousel({ category }: { category: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const products = Array(10)
    .fill(null)
    .map((_, i) => {
      const seed = category.name.charCodeAt(0) + i;
      const priceBase = seededRandom(seed * 123);
      const ratingBase = seededRandom(seed * 456);
      const soldBase = seededRandom(seed * 789);

      return {
        id: i,
        name: `${category.name} Product ${i + 1}`,
        price: `₹${500 + Math.floor(priceBase * 9500)}`,
        seller: "Verified Seller",
        image: `https://loremflickr.com/500/500/${category.name.toLowerCase().replace(/[^a-z]/g, "")}`,
        rating: (4 + ratingBase * 1).toFixed(1),
        sold: Math.floor(50 + soldBase * 500),
      };
    });

  return (
    <AnimatedSection className="bg-card border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div
            whileHover={{ rotate: 20 }}
            className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}
          >
            {category.icon}
          </motion.div>
          <div>
            <h2 className="text-lg md:text-2xl font-black">{category.name}</h2>
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {category.count} products
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            className="p-1.5 md:p-2 border-2 border-border rounded-lg hover:bg-muted hover:border-primary/30 transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            className="p-1.5 md:p-2 border-2 border-border rounded-lg hover:bg-muted hover:border-primary/30 transition-all"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
          <Link
            href={`/marketplace?category=${slugify(category.name)}`}
            className="ml-1 md:ml-2 text-xs md:text-sm font-bold text-primary hover:underline hidden sm:block"
          >
            View All
          </Link>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4 md:mx-0 md:px-0 pb-2"
      >
        {products.map((product, idx) => (
          <HorizontalProductCard
            key={product.id}
            product={product}
            index={idx}
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function HorizontalProductCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
      className="flex-shrink-0 w-[280px] md:w-[350px] bg-background border-2 border-border rounded-lg md:rounded-xl hover:border-primary/50 transition-all group cursor-pointer flex h-full relative"
    >
      <Link
        href={`/product/${slugify(product.seller || "Verified Seller")}/${slugify(product.name)}`}
        className="flex gap-2.5 md:gap-3 w-full p-2.5 md:p-3"
      >
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          <span className="text-muted-foreground/30 font-bold text-[10px] md:text-xs text-center sr-only">
            {product.image}
          </span>
          <motion.div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h4>
            <p className="text-[10px] md:text-xs text-muted-foreground mb-1">
              {product.seller}
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] text-muted-foreground">
                {product.rating} • {product.sold} sold
              </span>
            </div>
          </div>
          <p className="text-sm md:text-lg font-bold text-primary">
            {product.price}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function TimeBox({ value }: { value: number }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white text-red-600 px-1 md:px-2 py-0.5 md:py-1 rounded font-bold text-xs md:text-sm min-w-[24px] md:min-w-[32px] text-center"
    >
      {value.toString().padStart(2, "0")}
    </motion.div>
  );
}
