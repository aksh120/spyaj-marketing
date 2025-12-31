"use client";

import { motion } from "framer-motion";
import { Users, Target, ShieldCheck, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          About SPYAJ Marketing
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          We are India's premier B2B marketplace, bridging the gap between
          manufacturers and buyers globally. Our mission is to simplify trade
          through technology and trust.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: "Our Mission",
            desc: "To empower businesses with seamless global trade solutions.",
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "Trust & Safety",
            desc: "Varified sellers and secure escrow payments for peace of mind.",
          },
          {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: "Community",
            desc: "A growing network of over 50,000+ verified businesses.",
          },
          {
            icon: <Globe className="w-8 h-8 text-primary" />,
            title: "Global Reach",
            desc: "Connecting suppliers from India to 200+ countries.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border-2 border-border p-6 rounded-2xl text-center hover:border-primary/50 transition-all"
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {item.icon}
            </div>
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
