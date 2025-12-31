"use client";

import { motion } from "framer-motion";
import { ShieldCheck, RefreshCcw, Lock, Truck } from "lucide-react";

export default function BuyersProtection() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShieldCheck className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Buyer Protection Program
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Shop with confidence. We protect your purchases from click to
          delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            icon: <Lock className="w-8 h-8 text-blue-500" />,
            title: "Secure Payments",
            desc: "Your payment is held in our secure Escrow account and is only released to the seller after you confirm satisfactory delivery.",
          },
          {
            icon: <RefreshCcw className="w-8 h-8 text-green-500" />,
            title: "Easy Refunds",
            desc: "If your order doesn't arrive or isn't as described, we'll help you get a full refund easily.",
          },
          {
            icon: <Truck className="w-8 h-8 text-orange-500" />,
            title: "Shipping Protection",
            desc: "All shipments are tracked. If a package is lost in transit, you are fully covered.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-card border-2 border-border p-8 rounded-2xl text-center hover:shadow-lg transition-all"
          >
            <div className="bg-background w-16 h-16 rounded-2xl border-2 border-border flex items-center justify-center mx-auto mb-6 shadow-sm">
              {item.icon}
            </div>
            <h3 className="font-bold text-xl mb-3">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
