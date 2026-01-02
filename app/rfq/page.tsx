"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UploadCloud, IndianRupee, Send, CheckCircle2 } from "lucide-react";

export default function RFQPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-[80px] md:pt-[100px]">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black mb-4"
        >
          Post a Request for Quotation
        </motion.h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tell us what you need, and receive competitive quotes from verified
          suppliers within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border-2 border-border rounded-2xl p-6 md:p-8 shadow-sm">
            {submitted ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">
                  Request Posted Successfully!
                </h2>
                <p className="text-muted-foreground">
                  Suppliers will start reviewing your request shortly. You will
                  be notified via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Cotton 40s Comb Yarn"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category</label>
                    <select className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors">
                      <option>Select Category</option>
                      <option>Textiles</option>
                      <option>Industrial Machinery</option>
                      <option>Electronics</option>
                      <option>Chemicals</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      Quantity Required
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5000 Units"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      Target Budget (Optional)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Detailed Requirements
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe specifications, material grade, certification requirements, etc."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors font-sans"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Attachments</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="font-medium text-sm">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Post Request Now
                </button>
              </form>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-4">Why Post an RFQ?</h3>
            <ul className="space-y-4">
              {[
                "Get multiple quotes within 24 hours",
                "Compare prices and negotiate deals",
                "Verified suppliers only",
                "100% Free for buyers",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Active Requests</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm">Industrial Gearbox</h4>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                      Open
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Quantity: 50 Units • Budget: ₹2.5L
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    Posted 2 hours ago
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
