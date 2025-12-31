"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const contactMethods = [
  {
    icon: <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />,
    title: "Live Chat",
    desc: "Available 24/7 for urgent business support.",
    action: "Start Chat",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />,
    title: "Email Support",
    desc: "support@spyaj.com - Response within 24h.",
    action: "Send Email",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    icon: <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />,
    title: "Phone Support",
    desc: "+91 (123) 456-7890 - Trade assistance.",
    action: "Call Now",
    color: "from-yellow-500/20 to-yellow-600/10",
  },
  {
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />,
    title: "Business Hours",
    desc: "Mon - Fri: 9 AM to 6 PM (IST).",
    action: "View Schedule",
    color: "from-orange-500/20 to-orange-600/10",
  },
];

const faqs = [
  {
    q: "How do I become a seller?",
    a: "Register on our platform, complete verification, and start listing your products.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept bank transfers, cards, UPI, and escrow payments for secure transactions.",
  },
  {
    q: "How long does shipping take?",
    a: "Domestic orders: 3-7 days. International: 10-21 days depending on destination.",
  },
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 pt-[80px] md:pt-[120px]">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
        >
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto"
        >
          "Connect. Trade. Grow." - Let us help you connect with the right
          business partners.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className="space-y-6 md:space-y-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4"
          >
            {contactMethods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className={`bg-gradient-to-br ${method.color} border-2 border-border rounded-xl md:rounded-2xl p-4 md:p-5 group cursor-pointer transition-all`}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-background rounded-lg md:rounded-xl flex items-center justify-center mb-3 shadow-sm"
                >
                  {method.icon}
                </motion.div>
                <h4 className="font-bold text-sm md:text-base mb-1">
                  {method.title}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground mb-3">
                  {method.desc}
                </p>
                <motion.span
                  whileHover={{ x: 5 }}
                  className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {method.action} <ArrowRight className="w-3 h-3" />
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="p-5 md:p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl md:rounded-3xl border-2 border-primary/20"
          >
            <h3 className="font-bold text-base md:text-xl mb-3 md:mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Visit Our Headquarters
            </h3>
            <div className="flex gap-3 md:gap-4 text-muted-foreground">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-xl flex-shrink-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground mb-1">
                  SPYAJ Marketing Pvt. Ltd.
                </p>
                <p className="text-sm md:text-base">
                  123 Business, Industrial Zone,
                  <br />
                  Pune, Maharashtra, India - 364001
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="font-bold text-base md:text-xl mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  className="border-2 border-border rounded-xl overflow-hidden"
                >
                  <motion.button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 font-semibold text-sm flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    {faq.q}
                    <motion.span
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.span>
                  </motion.button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card border-2 border-border rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-xl sticky top-24"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-2xl font-bold mb-1">
                    Send us a message
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We'd love to hear from you
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-1.5 md:space-y-2"
                  >
                    <label className="text-xs md:text-sm font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-background border-2 border-border px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-1.5 md:space-y-2"
                  >
                    <label className="text-xs md:text-sm font-semibold">
                      Business Email
                    </label>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-background border-2 border-border px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-1.5 md:space-y-2"
                >
                  <label className="text-xs md:text-sm font-semibold">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-background border-2 border-border px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Become a Seller</option>
                    <option>Trade Dispute</option>
                    <option>Enterprise Solutions</option>
                    <option>Technical Support</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-1.5 md:space-y-2"
                >
                  <label className="text-xs md:text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help your business today?"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-background border-2 border-border px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  ></textarea>
                </motion.div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(var(--primary)/0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-3 md:py-4 rounded-lg md:rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
