"use client";

import { motion } from "framer-motion";

export default function Careers() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px] text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">Join Our Team</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
        We are always looking for talented individuals to help us revolutionize
        B2B trade.
      </p>

      <div className="p-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
        <h3 className="text-xl font-bold mb-2">No Openings Currently</h3>
        <p className="text-muted-foreground">Check back later for updates!</p>
      </div>
    </div>
  );
}
