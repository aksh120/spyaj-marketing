"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I create a buyer account?",
    a: "Click on 'Sign Up' in the top right corner and select 'Buyer' during registration.",
  },
  {
    q: "Is it safe to buy on SPYAJ?",
    a: "Yes, we verify all sellers and offer Escrow protection on every order to ensure your funds are safe until delivery.",
  },
  {
    q: "How do I calculate shipping costs?",
    a: "Shipping costs are calculated automatically at checkout based on the seller's location and your delivery address.",
  },
  {
    q: "Can I negotiate prices?",
    a: "Yes! Use the 'Contact Seller' or 'Make an Offer' button on product pages to negotiate bulk deals.",
  },
  {
    q: "What constitutes a 'Verified Seller'?",
    a: "Verified Sellers have undergone our strict business verification process, including document checks and physical site visits in some cases.",
  },
];

export default function BuyersFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
        Buyers FAQ
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={false}
            className="border-2 border-border rounded-xl overflow-hidden bg-card"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 md:p-6 text-left font-semibold hover:bg-muted/50 transition-colors"
            >
              {faq.q}
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              />
            </button>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: openIndex === idx ? "auto" : 0 }}
              className="overflow-hidden"
            >
              <p className="p-4 md:p-6 pt-0 text-muted-foreground">{faq.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
