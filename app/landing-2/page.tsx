"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Factory,
  ShieldCheck,
  Globe,
  Headphones,
  CreditCard,
  Search,
  MessageSquare,
  Handshake,
  Package,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  TrendingUp,
  Building2,
  Cpu,
  Shirt,
  Beaker,
  HeartPulse,
  Sprout,
  Gem,
  Cog,
  Stethoscope,
  Truck,
  FileText,
  Phone,
  ArrowRight,
  Quote,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  Shield,
  BadgeCheck,
  Users,
  BarChart3,
  Wallet,
  RefreshCw,
  Bell,
  Download,
  Smartphone,
  Mail,
  MapPin,
  Play,
  Activity,
  IndianRupee,
  Target,
  Briefcase,
  CheckCircle,
  Timer,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const trustFeatures = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    text: "Verified Suppliers",
    desc: "100% Authenticated",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    text: "Secure Payments",
    desc: "Escrow Protected",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    text: "Trade Assurance",
    desc: "On-time Delivery",
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    text: "24/7 Support",
    desc: "Dedicated Team",
  },
];

const industries = [
  {
    name: "Electronics & Electrical",
    icon: <Cpu className="w-6 h-6" />,
    suppliers: "2,500+",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    name: "Textiles & Apparel",
    icon: <Shirt className="w-6 h-6" />,
    suppliers: "3,200+",
    color: "from-pink-500/20 to-pink-600/10",
  },
  {
    name: "Chemicals & Dyes",
    icon: <Beaker className="w-6 h-6" />,
    suppliers: "1,800+",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    name: "Machinery & Equipment",
    icon: <Cog className="w-6 h-6" />,
    suppliers: "2,100+",
    color: "from-gray-500/20 to-gray-600/10",
  },
  {
    name: "Healthcare & Pharma",
    icon: <Stethoscope className="w-6 h-6" />,
    suppliers: "1,500+",
    color: "from-red-500/20 to-red-600/10",
  },
  {
    name: "Agriculture & Food",
    icon: <Sprout className="w-6 h-6" />,
    suppliers: "2,800+",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    name: "Construction & Building",
    icon: <Building2 className="w-6 h-6" />,
    suppliers: "1,900+",
    color: "from-orange-500/20 to-orange-600/10",
  },
  {
    name: "Mining & Metals",
    icon: <Gem className="w-6 h-6" />,
    suppliers: "1,200+",
    color: "from-slate-500/20 to-slate-600/10",
  },
  {
    name: "Industrial Supplies",
    icon: <Factory className="w-6 h-6" />,
    suppliers: "2,400+",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    name: "Healthcare Products",
    icon: <HeartPulse className="w-6 h-6" />,
    suppliers: "1,600+",
    color: "from-rose-500/20 to-rose-600/10",
  },
  {
    name: "Logistics & Shipping",
    icon: <Truck className="w-6 h-6" />,
    suppliers: "800+",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    name: "IT & Services",
    icon: <Globe className="w-6 h-6" />,
    suppliers: "1,100+",
    color: "from-indigo-500/20 to-indigo-600/10",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Search Products",
    desc: "Browse 500K+ products from verified suppliers",
    icon: <Search className="w-8 h-8" />,
  },
  {
    step: 2,
    title: "Connect with Suppliers",
    desc: "Get instant quotes and negotiate directly",
    icon: <MessageSquare className="w-8 h-8" />,
  },
  {
    step: 3,
    title: "Place Bulk Orders",
    desc: "Secure transactions with trade assurance",
    icon: <Handshake className="w-8 h-8" />,
  },
  {
    step: 4,
    title: "Receive & Grow",
    desc: "Reliable delivery with quality guarantee",
    icon: <Package className="w-8 h-8" />,
  },
];

const stats = [
  { value: 10000, suffix: "+", label: "Verified Suppliers" },
  { value: 500000, suffix: "+", label: "Products Listed" },
  { value: 50000, suffix: "+", label: "Active Buyers" },
  { value: 2, suffix: "M+", label: "Orders Fulfilled" },
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Procurement Head",
    company: "Tata Industries",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "SPYAJ revolutionized our procurement process. We reduced costs by 30% while maintaining quality standards.",
    industry: "Manufacturing",
    orderVolume: "₹2Cr+ monthly",
  },
  {
    name: "Priya Patel",
    role: "Supply Chain Manager",
    company: "Reliance Retail",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "The verified supplier network gave us confidence in every transaction. Outstanding platform for B2B trade.",
    industry: "Retail",
    orderVolume: "₹5Cr+ monthly",
  },
  {
    name: "Amit Kumar",
    role: "Director",
    company: "Mahindra Exports",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote:
      "From finding suppliers to closing deals, SPYAJ made international sourcing seamless and secure.",
    industry: "Export",
    orderVolume: "₹1Cr+ monthly",
  },
];

const faqs = [
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "MOQ varies by supplier and product. Most suppliers offer flexible MOQs starting from as low as 10 units for samples and 100+ units for bulk orders.",
  },
  {
    q: "How do I verify supplier authenticity?",
    a: "All suppliers undergo KYC verification, factory audits, and receive badges based on their verification level (Gold, Silver, Bronze). Look for the verified badge on supplier profiles.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We support bank transfers, credit/debit cards, UPI, and escrow payments. Trade Assurance protects your payment until order delivery.",
  },
  {
    q: "How long does shipping take?",
    a: "Domestic orders typically take 3-7 business days. International shipping varies by destination (7-21 days). Express options available.",
  },
  {
    q: "Can I request product samples?",
    a: "Yes! Most suppliers offer sample orders. Use the 'Request Sample' button on product pages to get samples before bulk ordering.",
  },
];

const featuredSuppliers = [
  {
    name: "Textile Hub India",
    category: "Textiles",
    rating: 4.9,
    responseTime: "< 2 hrs",
    verified: "Gold",
    orders: "5000+",
  },
  {
    name: "ElectroChem Industries",
    category: "Chemicals",
    rating: 4.8,
    responseTime: "< 1 hr",
    verified: "Gold",
    orders: "3200+",
  },
  {
    name: "Precision Machinery Co.",
    category: "Machinery",
    rating: 4.7,
    responseTime: "< 4 hrs",
    verified: "Silver",
    orders: "2100+",
  },
  {
    name: "Agro Fresh Exports",
    category: "Agriculture",
    rating: 4.9,
    responseTime: "< 2 hrs",
    verified: "Gold",
    orders: "4500+",
  },
  {
    name: "MediSupply Global",
    category: "Healthcare",
    rating: 4.8,
    responseTime: "< 3 hrs",
    verified: "Gold",
    orders: "1800+",
  },
];

const verificationTiers = [
  {
    tier: "Gold",
    icon: <Award className="w-8 h-8" />,
    color: "from-yellow-400 to-yellow-600",
    features: [
      "Factory Verified",
      "Financial Check",
      "Quality Audit",
      "5+ Years Active",
    ],
    badge: "bg-yellow-500 text-white",
  },
  {
    tier: "Silver",
    icon: <Shield className="w-8 h-8" />,
    color: "from-gray-300 to-gray-500",
    features: [
      "Business Verified",
      "KYC Complete",
      "Trade History",
      "2+ Years Active",
    ],
    badge: "bg-gray-500 text-white",
  },
  {
    tier: "Bronze",
    icon: <BadgeCheck className="w-8 h-8" />,
    color: "from-amber-600 to-amber-800",
    features: [
      "Basic Verification",
      "ID Verified",
      "Contact Verified",
      "New Supplier",
    ],
    badge: "bg-amber-600 text-white",
  },
];

const buyerBenefits = [
  {
    icon: <IndianRupee className="w-6 h-6" />,
    title: "Bulk Pricing",
    desc: "Get wholesale rates directly from manufacturers",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Trade Protection",
    desc: "100% money-back guarantee on every order",
  },
  {
    icon: <Timer className="w-6 h-6" />,
    title: "Fast Quotes",
    desc: "Receive multiple quotes within 24 hours",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Quality Assured",
    desc: "Pre-shipment inspection on bulk orders",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Easy Returns",
    desc: "Hassle-free returns for defective products",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Credit Terms",
    desc: "Flexible payment terms for trusted buyers",
  },
];

const liveTrades = [
  {
    buyer: "Mumbai Enterprise",
    product: "Cotton Fabric",
    quantity: "5,000 meters",
    time: "2 min ago",
  },
  {
    buyer: "Delhi Traders",
    product: "Steel Pipes",
    quantity: "200 tons",
    time: "5 min ago",
  },
  {
    buyer: "Bangalore Tech",
    product: "Electronic Components",
    quantity: "10,000 units",
    time: "8 min ago",
  },
  {
    buyer: "Chennai Exports",
    product: "Leather Goods",
    quantity: "500 pieces",
    time: "12 min ago",
  },
  {
    buyer: "Kolkata Industries",
    product: "Chemical Dyes",
    quantity: "2,000 kg",
    time: "15 min ago",
  },
];

const partnerLogos = [
  "Tata",
  "Reliance",
  "Mahindra",
  "Infosys",
  "Wipro",
  "HCL",
  "Bajaj",
  "Godrej",
];

export default function LandingPage2() {
  return (
    <main className="min-h-screen pt-[80px] md:pt-[100px] bg-background overflow-hidden">
      <HeroSection />
      <TrustBar />
      <LiveTradeFeed />
      <IndustriesSection />
      <VerificationTiersSection />
      <HowItWorksSection />
      <BuyerBenefitsSection />
      <StatsSection />
      <FeaturedSuppliersSection />
      <RFQSection />
      <TestimonialsSection />
      <PartnerLogosSection />
      <FAQSection />
      <NewsletterSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
    springConfig,
  );

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex items-center overflow-hidden perspective-1000"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: isDark ? "#020617" : "#ffffff" }}
      >
        {isDark && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-blue-900/20 to-transparent" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
            />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 w-full pb-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ y, opacity }} className="relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 backdrop-blur-xl px-4 py-2 rounded-full mb-8"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
                borderWidth: 1,
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span
                className="text-sm font-medium tracking-wide"
                style={{ color: isDark ? "rgba(255,255,255,0.9)" : "#374151" }}
              >
                Next-Gen B2B Sourcing
              </span>
            </motion.div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              The Future of <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? "from-blue-400 via-cyan-400 to-blue-400" : "from-blue-600 via-indigo-600 to-blue-600"} animate-gradient-x bg-[length:200%_auto]`}
              >
                Global Trade
              </span>
            </h1>

            <p
              className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
              style={{ color: isDark ? "rgba(191,219,254,0.7)" : "#4b5563" }}
            >
              Connect with 10,000+ verified factories. Experience AI-powered
              sourcing, real-time tracking, and bank-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/marketplace"
                  className="group relative inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-xl overflow-hidden transition-all"
                  style={{
                    backgroundColor: isDark ? "#ffffff" : "#2563eb",
                    color: isDark ? "#1e3a5f" : "#ffffff",
                    boxShadow: isDark
                      ? "0 0 40px -10px rgba(255,255,255,0.3)"
                      : "0 0 40px -10px rgba(37,99,235,0.5)",
                  }}
                >
                  <span className="relative flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Suppliers
                  </span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#rfq"
                  className="group inline-flex items-center justify-center gap-3 backdrop-blur-md font-bold px-8 py-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "#f3f4f6",
                    color: isDark ? "#ffffff" : "#111827",
                    borderWidth: 1,
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
                  }}
                >
                  <span>Get Custom Quote</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative h-[600px] w-full hidden lg:flex items-center justify-center perspective-[2000px]">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-[500px] h-[500px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateX: 60 }}
                animate={{ opacity: 1, scale: 1, rotateX: 60 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-0 rounded-[40px] backdrop-blur-xl shadow-2xl"
                style={{
                  transform: "rotateX(60deg) rotateZ(-45deg)",
                  boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
                  background:
                    "linear-gradient(to bottom right, rgba(30,58,138,0.8), rgba(15,23,42,0.8))",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-[40px]"
                  style={{ opacity: 0.1 }}
                />
                <div
                  className="absolute inset-0 bg-[size:40px_40px] rounded-[40px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  }}
                />

                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-xl animate-pulse"
                  style={{ backgroundColor: "rgba(59,130,246,0.2)" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <Globe className="w-12 h-12 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100, z: 0 }}
                animate={{ opacity: 1, y: -40, z: 100 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="absolute top-[20%] right-[10%] p-4 backdrop-blur-md rounded-2xl flex items-center gap-3 shadow-xl"
                style={{
                  transform: "translateZ(100px)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: isDark ? "rgba(234,179,8,0.2)" : "#fef3c7",
                  }}
                >
                  <ShieldCheck
                    className="w-6 h-6"
                    style={{ color: isDark ? "#facc15" : "#ca8a04" }}
                  />
                </div>
                <div className="text-left">
                  <p
                    className="font-bold text-sm"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Verified
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280",
                    }}
                  >
                    Supplier ID #8821
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100, z: 0 }}
                animate={{ opacity: 1, y: 60, z: 150 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                className="absolute bottom-[20%] left-[0%] p-4 backdrop-blur-md rounded-2xl shadow-xl"
                style={{
                  transform: "translateZ(150px)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(34,197,94,0.2)"
                        : "#dcfce7",
                    }}
                  >
                    <TrendingUp
                      className="w-6 h-6"
                      style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: isDark ? "#ffffff" : "#111827" }}
                    >
                      Growth
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: isDark ? "#4ade80" : "#16a34a" }}
                    >
                      +124% Q3
                    </p>
                  </div>
                </div>
                <div
                  className="w-32 h-1 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e5e7eb",
                  }}
                >
                  <div
                    className="w-[70%] h-full"
                    style={{ backgroundColor: isDark ? "#4ade80" : "#22c55e" }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100, z: 0 }}
                animate={{ opacity: 1, y: -80, z: 80 }}
                transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
                className="absolute top-[16%] left-[8%] p-4 backdrop-blur-md rounded-2xl flex items-center gap-3 shadow-xl"
                style={{
                  transform: "translateZ(80px)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(59,130,246,0.2)"
                      : "#dbeafe",
                  }}
                >
                  <Truck
                    className="w-6 h-6"
                    style={{ color: isDark ? "#60a5fa" : "#2563eb" }}
                  />
                </div>
                <div className="text-left">
                  <p
                    className="font-bold text-sm"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Dispatched
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280",
                    }}
                  >
                    2 mins ago
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100, z: 0 }}
                animate={{ opacity: 1, y: 20, z: 120 }}
                transition={{ duration: 0.8, delay: 1.1, type: "spring" }}
                className="absolute bottom-[10%] right-[0%] p-4 backdrop-blur-md rounded-2xl flex items-center gap-3 shadow-xl"
                style={{
                  transform: "translateZ(120px)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ffffff",
                  borderWidth: 1,
                  borderColor: isDark ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(168,85,247,0.2)"
                      : "#f3e8ff",
                  }}
                >
                  <CreditCard
                    className="w-6 h-6"
                    style={{ color: isDark ? "#c084fc" : "#9333ea" }}
                  />
                </div>
                <div className="text-left">
                  <p
                    className="font-bold text-sm"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    Secure Pay
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280",
                    }}
                  >
                    ₹45,000 via Escrow
                  </p>
                </div>
              </motion.div>

              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: "translateZ(50px)" }}
              >
                <motion.path
                  d="M 100 100 L 250 250 L 400 100"
                  stroke="url(#gradient-line)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="10 10"
                  animate={{ strokeDashoffset: [0, 200] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <defs>
                  <linearGradient
                    id="gradient-line"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeprecatedHeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700 to-blue-900" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full border border-white/10"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -right-60 -top-60 w-[800px] h-[800px] rounded-full border border-white/5"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">
                India&apos;s Fastest Growing B2B Platform
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Connect with{" "}
              <span className="text-yellow-400">Verified Suppliers</span> Across
              India
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Access 10,000+ verified manufacturers and wholesalers. Get bulk
              pricing, trade assurance, and seamless B2B transactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Find Suppliers
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#rfq"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Request Quote
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { value: "10K+", label: "Suppliers" },
                { value: "500K+", label: "Products" },
                { value: "₹500Cr+", label: "Trade Volume" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-black text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl backdrop-blur-sm border border-white/20 p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[Factory, Globe, ShieldCheck, TrendingUp].map((Icon, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center"
                    >
                      <Icon className="w-16 h-16 text-white/80" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 relative overflow-hidden"
      style={{
        backgroundColor: isDark
          ? "rgba(15,23,42,0.8)"
          : "rgba(248,250,252,0.9)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm cursor-pointer transition-all"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.7)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-3 rounded-xl"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(16,185,129,0.2))"
                    : "linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))",
                }}
              >
                <span style={{ color: isDark ? "#2dd4bf" : "#0d9488" }}>
                  {feature.icon}
                </span>
              </motion.div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {feature.text}
                </p>
                <p
                  className="text-xs"
                  style={{
                    color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function IndustriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: isDark
              ? "rgba(20,184,166,0.1)"
              : "rgba(20,184,166,0.05)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            backgroundColor: isDark
              ? "rgba(16,185,129,0.1)"
              : "rgba(16,185,129,0.05)",
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: isDark
                ? "rgba(20,184,166,0.1)"
                : "rgba(20,184,166,0.1)",
              color: isDark ? "#2dd4bf" : "#0d9488",
              border: `1px solid ${isDark ? "rgba(20,184,166,0.2)" : "rgba(20,184,166,0.2)"}`,
            }}
          >
            50+ Industries
          </motion.span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
              Industries
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
          >
            Find verified suppliers across 50+ industries. From raw materials to
            finished goods.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {industries.map((industry, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link
                href={`/marketplace?category=${industry.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="block relative p-6 rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "#ffffff",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0,0,0,0.3)"
                    : "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))"
                      : "linear-gradient(135deg, rgba(20,184,166,0.05), rgba(16,185,129,0.05))",
                  }}
                />

                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    border: `1px solid ${isDark ? "rgba(20,184,166,0.4)" : "rgba(20,184,166,0.3)"}`,
                  }}
                />

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(16,185,129,0.2))"
                      : "linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))",
                  }}
                >
                  <span style={{ color: isDark ? "#2dd4bf" : "#0d9488" }}>
                    {industry.icon}
                  </span>
                </motion.div>
                <h3
                  className="relative font-bold text-base mb-2 group-hover:text-teal-500 transition-colors"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {industry.name}
                </h3>
                <div className="relative flex items-center gap-2">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isDark ? "#22c55e" : "#16a34a" }}
                  >
                    {industry.suppliers}
                  </span>
                  <span
                    style={{
                      color: isDark ? "rgba(255,255,255,0.5)" : "#9ca3af",
                    }}
                    className="text-sm"
                  >
                    suppliers
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full opacity-[0.03]"
          style={{ color: isDark ? "#ffffff" : "#000000" }}
        >
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: isDark
                ? "rgba(245,158,11,0.1)"
                : "rgba(245,158,11,0.1)",
              color: isDark ? "#fbbf24" : "#d97706",
              border: `1px solid ${isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.2)"}`,
            }}
          >
            Simple Process
          </motion.span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Works
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
          >
            Start sourcing in minutes. Our streamlined process makes B2B trade
            simple.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full origin-left"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, rgba(245,158,11,0.5), rgba(249,115,22,0.5), rgba(245,158,11,0.5))"
                  : "linear-gradient(90deg, rgba(245,158,11,0.3), rgba(249,115,22,0.3), rgba(245,158,11,0.3))",
              }}
            />
          </div>

          {howItWorks.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2 }}
              className="relative text-center group"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #f97316)",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(245,158,11,0.4)",
                }}
              >
                Step {step.step}
              </motion.span>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className="relative w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center z-10"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #f97316)",
                  boxShadow: isDark
                    ? "0 10px 40px rgba(245,158,11,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset"
                    : "0 10px 40px rgba(245,158,11,0.2)",
                }}
              >
                <span className="text-white">{step.icon}</span>
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: "0 0 30px rgba(245,158,11,0.5)",
                  }}
                />
              </motion.div>

              <h3
                className="font-bold text-xl mb-3"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSuppliersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: isDark ? "#020617" : "#ffffff" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(100,116,139,0.15), transparent 70%)"
              : "radial-gradient(circle, rgba(100,116,139,0.08), transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-4"
        >
          <div>
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor: isDark
                  ? "rgba(234,179,8,0.1)"
                  : "rgba(234,179,8,0.1)",
                color: isDark ? "#fbbf24" : "#ca8a04",
                border: `1px solid ${isDark ? "rgba(234,179,8,0.2)" : "rgba(234,179,8,0.2)"}`,
              }}
            >
              ⭐ Top Rated
            </motion.span>
            <h2
              className="text-4xl md:text-5xl font-black mb-3"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-zinc-400">
                Suppliers
              </span>
            </h2>
            <p
              style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
              className="text-lg"
            >
              Top-rated verified suppliers with excellent track records
            </p>
          </div>
          <Link
            href="/seller"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6",
              color: isDark ? "#ffffff" : "#111827",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
            }}
          >
            View All Suppliers <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredSuppliers.map((supplier, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group rounded-3xl overflow-hidden"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.4)"
                  : "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, rgba(100,116,139,0.05), rgba(71,85,105,0.05))"
                    : "linear-gradient(135deg, rgba(100,116,139,0.02), rgba(71,85,105,0.02))",
                }}
              />

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg"
                      style={{
                        background: "linear-gradient(135deg, #64748b, #475569)",
                        color: "#ffffff",
                      }}
                    >
                      {supplier.name.charAt(0)}
                    </motion.div>
                    <div>
                      <h3
                        className="font-bold text-lg"
                        style={{ color: isDark ? "#ffffff" : "#111827" }}
                      >
                        {supplier.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280",
                        }}
                      >
                        {supplier.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{
                      background:
                        supplier.verified === "Gold"
                          ? "linear-gradient(135deg, #f59e0b, #d97706)"
                          : isDark
                            ? "rgba(255,255,255,0.1)"
                            : "#f3f4f6",
                      color:
                        supplier.verified === "Gold"
                          ? "#ffffff"
                          : isDark
                            ? "#ffffff"
                            : "#374151",
                    }}
                  >
                    {supplier.verified === "Gold" && "✓ "}
                    {supplier.verified}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      icon: <Star className="w-4 h-4" />,
                      value: supplier.rating,
                      label: "Rating",
                      color: "#eab308",
                    },
                    {
                      icon: <Clock className="w-4 h-4" />,
                      value: supplier.responseTime,
                      label: "Response",
                      color: "#64748b",
                    },
                    {
                      icon: <Package className="w-4 h-4" />,
                      value: supplier.orders,
                      label: "Orders",
                      color: "#22c55e",
                    },
                  ].map((stat, j) => (
                    <div
                      key={j}
                      className="text-center p-3 rounded-2xl"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "#f8fafc",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span style={{ color: stat.color }}>{stat.icon}</span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: isDark ? "#ffffff" : "#111827" }}
                        >
                          {stat.value}
                        </span>
                      </div>
                      <span
                        className="text-[10px]"
                        style={{
                          color: isDark ? "rgba(255,255,255,0.4)" : "#9ca3af",
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/seller"
                  className="block text-center py-3 rounded-xl font-bold transition-all group-hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #334155, #1e293b)",
                    color: "#ffffff",
                  }}
                >
                  View Profile →
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RFQSection() {
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    email: "",
  });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      id="rfq"
      className="py-16 md:py-24 bg-gradient-to-r from-primary via-blue-600 to-blue-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Get Custom Quotes in{" "}
              <span className="text-yellow-400">24 Hours</span>
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Tell us what you need. Our network of 10,000+ suppliers will
              compete to offer you the best prices.
            </p>
            <div className="flex flex-wrap gap-4">
              {["Free to use", "No commitment", "Multiple quotes"].map(
                (item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 md:p-8 shadow-2xl"
            style={{
              backgroundColor: isDark ? "#18181b" : "#ffffff",
              borderWidth: 1,
              borderColor: isDark ? "#27272a" : "#f3f4f6",
            }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: isDark ? "#ffffff" : "#111827" }}
            >
              Request for Quote
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#d4d4d8" : "#374151" }}
                >
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cotton Yarn, Steel Pipes"
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({ ...formData, product: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  style={{
                    backgroundColor: isDark ? "#27272a" : "#ffffff",
                    borderWidth: 2,
                    borderColor: isDark ? "#3f3f46" : "#e5e7eb",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#d4d4d8" : "#374151" }}
                >
                  Quantity Required
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1000 units, 5 tons"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  style={{
                    backgroundColor: isDark ? "#27272a" : "#ffffff",
                    borderWidth: 2,
                    borderColor: isDark ? "#3f3f46" : "#e5e7eb",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? "#d4d4d8" : "#374151" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  style={{
                    backgroundColor: isDark ? "#27272a" : "#ffffff",
                    borderWidth: 2,
                    borderColor: isDark ? "#3f3f46" : "#e5e7eb",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isDark ? "#ffffff" : "#111827",
                  color: isDark ? "#111827" : "#ffffff",
                }}
              >
                <Zap className="w-5 h-5" />
                Get Free Quotes
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundColor: isDark ? "#111827" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
            className="absolute w-32 h-32 rounded-full blur-3xl"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              Thousands
            </span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#6b7280" }}
          >
            Join the fastest-growing B2B marketplace in India
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.15, type: "spring" }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="text-center p-6 rounded-3xl backdrop-blur-md"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                isInView={isInView}
                isDark={isDark}
              />
              <p
                className="font-medium text-sm mt-2"
                style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#6b7280" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({
  value,
  suffix,
  isInView,
  isDark,
}: {
  value: number;
  suffix: string;
  isInView: boolean;
  isDark: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(0);
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <p
      className="text-4xl md:text-5xl font-black mb-2"
      style={{ color: isDark ? "#ffffff" : "#111827" }}
    >
      {value >= 1000 ? formatNumber(count) : count}
      {suffix}
    </p>
  );
}

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div
        className="absolute top-20 left-10 text-9xl font-serif opacity-5"
        style={{ color: isDark ? "#ffffff" : "#000000" }}
      >
        "
      </div>
      <div
        className="absolute bottom-20 right-10 text-9xl font-serif opacity-5 rotate-180"
        style={{ color: isDark ? "#ffffff" : "#000000" }}
      >
        "
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: isDark
                ? "rgba(236,72,153,0.1)"
                : "rgba(236,72,153,0.1)",
              color: isDark ? "#f472b6" : "#db2777",
              border: `1px solid ${isDark ? "rgba(236,72,153,0.2)" : "rgba(236,72,153,0.2)"}`,
            }}
          >
            ❤️ Customer Love
          </motion.span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              50,000+ Businesses
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
          >
            See what our customers say about their experience with SPYAJ
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative p-10 md:p-14 rounded-3xl text-center"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isDark
                  ? "0 20px 60px rgba(0,0,0,0.4)"
                  : "0 20px 60px rgba(0,0,0,0.08)",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                }}
              >
                <Quote className="w-8 h-8 text-white" />
              </motion.div>

              <p
                className="text-xl md:text-2xl mb-10 leading-relaxed font-medium"
                style={{ color: isDark ? "#ffffff" : "#111827" }}
              >
                "{testimonials[activeIndex].quote}"
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl overflow-hidden"
                  style={{
                    border: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <Image
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p
                    className="font-bold text-lg"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {testimonials[activeIndex].name}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280",
                    }}
                  >
                    {testimonials[activeIndex].role},{" "}
                    {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(59,130,246,0.1)"
                      : "rgba(59,130,246,0.1)",
                    color: isDark ? "#60a5fa" : "#2563eb",
                  }}
                >
                  {testimonials[activeIndex].industry}
                </span>
                <span
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(34,197,94,0.1)",
                    color: isDark ? "#4ade80" : "#16a34a",
                  }}
                >
                  {testimonials[activeIndex].orderVolume}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveIndex(i)}
                className="transition-all rounded-full"
                style={{
                  width: i === activeIndex ? 32 : 12,
                  height: 12,
                  backgroundColor:
                    i === activeIndex
                      ? isDark
                        ? "#f472b6"
                        : "#ec4899"
                      : isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff" }}
    >
      <div className="max-w-[900px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              backgroundColor: isDark
                ? "rgba(244,63,94,0.1)"
                : "rgba(244,63,94,0.1)",
              color: isDark ? "#fb7185" : "#e11d48",
              border: `1px solid ${isDark ? "rgba(244,63,94,0.2)" : "rgba(244,63,94,0.2)"}`,
            }}
          >
            💡 Got Questions?
          </motion.span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: isDark ? "#ffffff" : "#111827" }}
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
              Questions
            </span>
          </h2>
          <p
            style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}
            className="text-lg"
          >
            Everything you need to know about B2B trade on SPYAJ
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isDark ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left font-bold transition-all"
                style={{
                  color: isDark ? "#ffffff" : "#111827",
                  backgroundColor:
                    openIndex === i
                      ? isDark
                        ? "rgba(244,63,94,0.1)"
                        : "rgba(244,63,94,0.05)"
                      : "transparent",
                }}
              >
                <span className="pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(244,63,94,0.2)"
                      : "rgba(244,63,94,0.1)",
                  }}
                >
                  <ChevronDown
                    className="w-5 h-5"
                    style={{ color: isDark ? "#fb7185" : "#e11d48" }}
                  />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-6 pb-6 leading-relaxed"
                      style={{
                        color: isDark ? "rgba(255,255,255,0.7)" : "#6b7280",
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-30, 30],
              x: [-20, 20],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
            className="absolute rounded-full"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              border: "1px solid rgba(255,255,255,0.1)",
              top: `${10 + i * 10}%`,
              left: `${5 + i * 12}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-5 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            🚀 Start Your Journey Today
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Transform
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-gradient-x">
              Your Business?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join 50,000+ businesses already sourcing smarter with SPYAJ. Start
            with a free account today.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-3 font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  color: "#0f172a",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                Start Sourcing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 font-bold px-10 py-5 rounded-2xl transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Phone className="w-5 h-5" />
                Talk to Sales
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LiveTradeFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveTrades.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-y border-green-500/20"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 hidden sm:block">
              LIVE TRADES
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <span className="font-medium">
                  {liveTrades[currentIndex].buyer}
                </span>
                <span className="text-muted-foreground">ordered</span>
                <span className="font-bold text-primary">
                  {liveTrades[currentIndex].product}
                </span>
                <span className="text-muted-foreground">-</span>
                <span className="font-medium">
                  {liveTrades[currentIndex].quantity}
                </span>
                <span className="text-xs text-muted-foreground hidden md:block">
                  ({liveTrades[currentIndex].time})
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            href="/marketplace"
            className="text-xs font-bold text-primary hover:underline hidden sm:block"
          >
            Start Trading →
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function VerificationTiersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Supplier <span className="text-primary">Verification</span> Tiers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every supplier is verified. Choose with confidence based on their
            certification level.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {verificationTiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              className="bg-card border-2 border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tier.color}`}
              />

              <motion.div
                whileHover={{ rotate: 10 }}
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white shadow-lg`}
              >
                {tier.icon}
              </motion.div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${tier.badge}`}
              >
                {tier.tier} Verified
              </span>

              <ul className="space-y-2 text-sm">
                {tier.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuyerBenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Why <span className="text-primary">Buyers</span> Choose Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for successful B2B procurement in one platform.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {buyerBenefits.map((benefit, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              className="bg-card border-2 border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all group"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
              >
                {benefit.icon}
              </motion.div>
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PartnerLogosSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          TRUSTED BY LEADING ENTERPRISES
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {partnerLogos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="px-6 py-3 bg-background border border-border rounded-lg"
            >
              <span className="text-xl font-bold text-muted-foreground/50">
                {logo}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AppDownloadSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 -bottom-20 w-[400px] h-[400px] rounded-full border border-white/10"
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Mobile App</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Trade On The Go
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Download the SPYAJ app to manage orders, chat with suppliers, and
              get real-time notifications anywhere.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl"
              >
                <Play className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-[10px] block opacity-70">
                    GET IT ON
                  </span>
                  <span className="font-bold">Google Play</span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl"
              >
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-[10px] block opacity-70">
                    Download on the
                  </span>
                  <span className="font-bold">App Store</span>
                </div>
              </motion.button>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">4.8</span>
                <span className="text-white/60 text-sm">Rating</span>
              </div>
              <div className="text-white/60">|</div>
              <div className="text-white">
                <span className="font-bold">100K+</span>
                <span className="text-white/60 text-sm ml-1">Downloads</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="w-[280px] h-[560px] bg-gradient-to-b from-white/20 to-white/5 rounded-[40px] backdrop-blur-sm border-2 border-white/30 p-3">
                <div className="w-full h-full bg-zinc-900 rounded-[32px] flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50 text-sm">App Preview</p>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                NEW
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Stay Updated with Trade Insights
          </h2>
          <p className="text-muted-foreground mb-8">
            Get weekly market trends, new supplier alerts, and exclusive deals.
            Join 25,000+ subscribers.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Subscribe
            </motion.button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. By subscribing you agree to our
            Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
