"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const footerLinks = {
  marketplace: [
    { label: "Industrial Goods", href: "/marketplace" },
    { label: "Electronics", href: "/marketplace" },
    { label: "Fashion & Textiles", href: "/marketplace" },
    { label: "Agriculture", href: "/marketplace" },
    { label: "All Categories", href: "/marketplace" },
  ],
  resources: [
    { label: "Become a Seller", href: "/seller-onboarding" },
    { label: "Help Center", href: "/contact" },
    { label: "Contact Support", href: "/contact" },
    { label: "Community Forum", href: "/forum" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
};

const socialLinks = [
  { icon: <Facebook className="w-4 h-4" />, href: "#", label: "Facebook" },
  { icon: <Twitter className="w-4 h-4" />, href: "#", label: "Twitter" },
  { icon: <Instagram className="w-4 h-4" />, href: "#", label: "Instagram" },
  { icon: <Linkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-muted/30 border-t pt-10 md:pt-16 pb-6 md:pb-8 px-4 md:px-6 mt-auto relative">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-10 md:mb-16"
        >
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-10 md:h-12 w-auto"
              >
                <Image
                  src={
                    mounted
                      ? resolvedTheme === "dark"
                        ? "/logo-dark.png"
                        : "/logo-light.png"
                      : "/logo-light.png"
                  }
                  alt="SPYAJ Marketing"
                  width={150}
                  height={60}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                />
              </motion.div>
            </Link>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-xs">
              India's most trusted B2B marketplace for global trade and local
              sourcing. Connect with verified suppliers worldwide.
            </p>

            <div className="mb-6">
              <h4 className="font-bold text-sm md:text-base mb-2 md:mb-3">
                Subscribe to Newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background border-2 border-border px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </form>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-500 mt-2"
                >
                  ✓ Thanks for subscribing!
                </motion.p>
              )}
            </div>

            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.marketplace.map((link, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">
              Resources
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.resources.map((link, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-3 mb-6">
              {footerLinks.company.map((link, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary" />
                <span>Pune, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-primary" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-primary" />
                <span>www.spyaj.com</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 md:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-muted-foreground"
        >
          <p>© 2025 SPYAJ Marketing Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
              { label: "Cookie Settings", href: "#" },
              { label: "Sitemap", href: "/sitemap" },
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
