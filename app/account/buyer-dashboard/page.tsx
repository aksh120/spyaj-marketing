"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  FileText,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  StatsCard,
  SimpleBarChart,
  ProgressBar,
} from "@/components/dashboard/DashboardComponents";

const mockOrders = [
  {
    id: "ORD-001",
    product: "Cotton Yarn 30s",
    status: "delivered",
    amount: "₹45,000",
    date: "Dec 28, 2024",
  },
  {
    id: "ORD-002",
    product: "Steel Pipes 2inch",
    status: "shipped",
    amount: "₹1,20,000",
    date: "Dec 25, 2024",
  },
  {
    id: "ORD-003",
    product: "LED Bulbs Pack",
    status: "processing",
    amount: "₹8,500",
    date: "Dec 20, 2024",
  },
  {
    id: "ORD-004",
    product: "Organic Chemicals",
    status: "delivered",
    amount: "₹75,000",
    date: "Dec 15, 2024",
  },
];

const mockSavedProducts = [
  {
    id: 1,
    name: "Industrial Motor",
    price: "₹25,000",
    image: "https://loremflickr.com/200/200/motor",
  },
  {
    id: 2,
    name: "Textile Fabric Roll",
    price: "₹8,000",
    image: "https://loremflickr.com/200/200/fabric",
  },
  {
    id: 3,
    name: "Copper Wire Bundle",
    price: "₹12,000",
    image: "https://loremflickr.com/200/200/wire",
  },
];

const mockRFQs = [
  {
    id: "RFQ-101",
    product: "Bulk Cotton Yarn",
    status: "awaiting",
    responses: 3,
  },
  {
    id: "RFQ-102",
    product: "Industrial Equipment",
    status: "quoted",
    responses: 5,
  },
];

export default function BuyerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-[100px]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black mb-2">Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your activity overview.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Orders"
          value="24"
          change={12}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Spent"
          value="₹4.5L"
          change={8}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Saved Products"
          value="18"
          change={-2}
          icon={<Heart className="w-5 h-5" />}
        />
        <StatsCard
          title="Active RFQs"
          value="5"
          change={25}
          icon={<FileText className="w-5 h-5" />}
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
              <TrendingUp className="w-5 h-5 text-primary" />
              Spending Trend
            </h2>
            <span className="text-xs text-muted-foreground">
              Last 12 months
            </span>
          </div>
          <SimpleBarChart
            data={[30, 45, 35, 50, 60, 55, 70, 65, 80, 75, 90, 85]}
            height={150}
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border-2 border-border rounded-xl p-4"
        >
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            RFQ Status
          </h2>
          <div className="space-y-3">
            {mockRFQs.map((rfq) => (
              <div key={rfq.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{rfq.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      rfq.status === "quoted"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {rfq.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{rfq.product}</p>
                <p className="text-xs text-primary font-medium mt-1">
                  {rfq.responses} responses
                </p>
              </div>
            ))}
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
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-bold text-sm">{order.product}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{order.amount}</p>
                  <div
                    className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "shipped"
                          ? "text-blue-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {order.status === "delivered" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {order.status === "shipped" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {order.status === "processing" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                </div>
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
              <Heart className="w-5 h-5 text-primary" />
              Saved Products
            </h2>
            <Link
              href="/account/wishlist"
              className="text-xs text-primary font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mockSavedProducts.map((product) => (
              <div key={product.id} className="text-center">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-medium truncate">{product.name}</p>
                <p className="text-xs text-primary font-bold">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
