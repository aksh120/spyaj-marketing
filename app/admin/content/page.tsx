"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Search,
  Settings,
  Loader2,
  FileText,
  Image,
  Code,
  Type,
  CheckCircle,
  RefreshCw,
  Plus,
  X,
  Globe,
  Phone,
  Mail,
  MapPin,
  Share2,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db";

interface SiteContent {
  id: string;
  key: string;
  content_type: "text" | "html" | "image" | "json";
  value: string;
  page: string | null;
  section: string | null;
  description: string | null;
}

const contentTypeIcons = {
  text: Type,
  html: Code,
  image: Image,
  json: FileText,
};

const contentTypeColors = {
  text: "bg-blue-100 text-blue-700",
  html: "bg-purple-100 text-purple-700",
  image: "bg-green-100 text-green-700",
  json: "bg-orange-100 text-orange-700",
};

const pageIcons: Record<string, typeof Globe> = {
  global: Globe,
  home: Globe,
  landing: Globe,
  about: FileText,
  contact: Phone,
  social: Share2,
  seo: Settings,
  seller: Settings,
};

const defaultContentItems: Omit<SiteContent, "id">[] = [
  {
    key: "hero_title",
    content_type: "text",
    value: "Connect with Verified Suppliers Across India",
    page: "landing",
    section: "hero",
    description: "Main hero section title",
  },
  {
    key: "hero_subtitle",
    content_type: "text",
    value:
      "Access 10,000+ verified manufacturers and wholesalers. Get bulk pricing, trade assurance, and seamless B2B transactions.",
    page: "landing",
    section: "hero",
    description: "Hero section description",
  },
  {
    key: "hero_badge",
    content_type: "text",
    value: "India's Fastest Growing B2B Platform",
    page: "landing",
    section: "hero",
    description: "Hero badge text",
  },
  {
    key: "hero_cta_primary",
    content_type: "text",
    value: "Find Suppliers",
    page: "landing",
    section: "hero",
    description: "Primary CTA button text",
  },
  {
    key: "hero_cta_secondary",
    content_type: "text",
    value: "Request Quote",
    page: "landing",
    section: "hero",
    description: "Secondary CTA button text",
  },
  {
    key: "hero_stats_suppliers",
    content_type: "text",
    value: "10K+",
    page: "landing",
    section: "hero",
    description: "Number of suppliers stat",
  },
  {
    key: "hero_stats_products",
    content_type: "text",
    value: "500K+",
    page: "landing",
    section: "hero",
    description: "Number of products stat",
  },
  {
    key: "hero_stats_volume",
    content_type: "text",
    value: "₹500Cr+",
    page: "landing",
    section: "hero",
    description: "Trade volume stat",
  },

  {
    key: "industries_title",
    content_type: "text",
    value: "Explore Industries",
    page: "landing",
    section: "industries",
    description: "Industries section title",
  },
  {
    key: "industries_subtitle",
    content_type: "text",
    value:
      "Find verified suppliers across 50+ industries. From raw materials to finished goods.",
    page: "landing",
    section: "industries",
    description: "Industries section subtitle",
  },
  {
    key: "industries_badge",
    content_type: "text",
    value: "50+ Industries",
    page: "landing",
    section: "industries",
    description: "Industries section badge",
  },

  {
    key: "rfq_title",
    content_type: "text",
    value: "Get Custom Quotes in 24 Hours",
    page: "landing",
    section: "rfq",
    description: "RFQ section main title",
  },
  {
    key: "rfq_subtitle",
    content_type: "text",
    value:
      "Tell us what you need. Our network of 10,000+ suppliers will compete to offer you the best prices.",
    page: "landing",
    section: "rfq",
    description: "RFQ section subtitle",
  },
  {
    key: "rfq_form_title",
    content_type: "text",
    value: "Request for Quote",
    page: "landing",
    section: "rfq",
    description: "RFQ form title",
  },
  {
    key: "rfq_button_text",
    content_type: "text",
    value: "Get Free Quotes",
    page: "landing",
    section: "rfq",
    description: "RFQ submit button text",
  },

  {
    key: "suppliers_title",
    content_type: "text",
    value: "Featured Suppliers",
    page: "landing",
    section: "suppliers",
    description: "Featured suppliers section title",
  },
  {
    key: "suppliers_subtitle",
    content_type: "text",
    value: "Top-rated verified suppliers with excellent track records",
    page: "landing",
    section: "suppliers",
    description: "Featured suppliers section subtitle",
  },
  {
    key: "suppliers_badge",
    content_type: "text",
    value: "⭐ Top Rated",
    page: "landing",
    section: "suppliers",
    description: "Featured suppliers badge text",
  },

  {
    key: "stats_suppliers",
    content_type: "text",
    value: "10000",
    page: "landing",
    section: "stats",
    description: "Total verified suppliers count",
  },
  {
    key: "stats_products",
    content_type: "text",
    value: "500000",
    page: "landing",
    section: "stats",
    description: "Total products listed count",
  },
  {
    key: "stats_buyers",
    content_type: "text",
    value: "50000",
    page: "landing",
    section: "stats",
    description: "Active buyers count",
  },
  {
    key: "stats_orders",
    content_type: "text",
    value: "2000000",
    page: "landing",
    section: "stats",
    description: "Orders fulfilled count (shown as 2M+)",
  },

  {
    key: "cta_title",
    content_type: "text",
    value: "Ready to Transform Your Business?",
    page: "landing",
    section: "cta",
    description: "CTA section title",
  },
  {
    key: "cta_subtitle",
    content_type: "text",
    value: "Join thousands of businesses already growing with SPYAJ",
    page: "landing",
    section: "cta",
    description: "CTA section subtitle",
  },
  {
    key: "cta_button",
    content_type: "text",
    value: "Get Started Free",
    page: "landing",
    section: "cta",
    description: "CTA button text",
  },

  {
    key: "about_title",
    content_type: "text",
    value: "About SPYAJ Marketing",
    page: "about",
    section: "main",
    description: "About page title",
  },
  {
    key: "about_description",
    content_type: "html",
    value:
      "<p>SPYAJ Marketing is India's premier B2B marketplace connecting buyers with verified suppliers across industries. Founded with a vision to simplify trade, we've helped thousands of businesses find the right partners.</p>",
    page: "about",
    section: "main",
    description: "About page main content",
  },
  {
    key: "about_mission",
    content_type: "text",
    value:
      "To empower businesses with seamless B2B connections and trusted trade partnerships.",
    page: "about",
    section: "mission",
    description: "Company mission statement",
  },
  {
    key: "about_vision",
    content_type: "text",
    value: "To become India's most trusted B2B marketplace by 2030.",
    page: "about",
    section: "vision",
    description: "Company vision statement",
  },
  {
    key: "about_founded",
    content_type: "text",
    value: "2020",
    page: "about",
    section: "info",
    description: "Year company was founded",
  },
  {
    key: "about_employees",
    content_type: "text",
    value: "100+",
    page: "about",
    section: "info",
    description: "Number of employees",
  },

  {
    key: "contact_email",
    content_type: "text",
    value: "support@spyaj.com",
    page: "global",
    section: "contact",
    description: "Support email address",
  },
  {
    key: "contact_phone",
    content_type: "text",
    value: "+91 (123) 456-7890",
    page: "global",
    section: "contact",
    description: "Support phone number",
  },
  {
    key: "contact_phone_alt",
    content_type: "text",
    value: "+91 (987) 654-3210",
    page: "global",
    section: "contact",
    description: "Alternate phone number",
  },
  {
    key: "contact_address",
    content_type: "text",
    value:
      "123 Business Park, Industrial Zone, Pune, Maharashtra, India - 364001",
    page: "global",
    section: "contact",
    description: "Company address",
  },
  {
    key: "contact_hours",
    content_type: "text",
    value: "Mon - Sat: 9:00 AM - 6:00 PM IST",
    page: "global",
    section: "contact",
    description: "Business hours",
  },

  {
    key: "footer_tagline",
    content_type: "text",
    value: "Your trusted partner in B2B trade",
    page: "global",
    section: "footer",
    description: "Footer tagline",
  },
  {
    key: "footer_copyright",
    content_type: "text",
    value: "© 2024 SPYAJ Marketing. All rights reserved.",
    page: "global",
    section: "footer",
    description: "Copyright text",
  },

  {
    key: "social_facebook",
    content_type: "text",
    value: "https://facebook.com/spyaj",
    page: "social",
    section: "links",
    description: "Facebook page URL",
  },
  {
    key: "social_twitter",
    content_type: "text",
    value: "https://twitter.com/spyaj",
    page: "social",
    section: "links",
    description: "Twitter/X profile URL",
  },
  {
    key: "social_linkedin",
    content_type: "text",
    value: "https://linkedin.com/company/spyaj",
    page: "social",
    section: "links",
    description: "LinkedIn company page URL",
  },
  {
    key: "social_instagram",
    content_type: "text",
    value: "https://instagram.com/spyaj",
    page: "social",
    section: "links",
    description: "Instagram profile URL",
  },
  {
    key: "social_youtube",
    content_type: "text",
    value: "https://youtube.com/@spyaj",
    page: "social",
    section: "links",
    description: "YouTube channel URL",
  },
  {
    key: "social_whatsapp",
    content_type: "text",
    value: "+919876543210",
    page: "social",
    section: "links",
    description: "WhatsApp business number",
  },

  {
    key: "seo_title",
    content_type: "text",
    value: "SPYAJ Marketing | India's Trusted B2B Marketplace",
    page: "seo",
    section: "meta",
    description: "Default page title (SEO)",
  },
  {
    key: "seo_description",
    content_type: "text",
    value:
      "Connect with verified suppliers and buyers on India's leading B2B marketplace. Find industrial products, raw materials, and more.",
    page: "seo",
    section: "meta",
    description: "Default meta description (SEO)",
  },
  {
    key: "seo_keywords",
    content_type: "text",
    value:
      "B2B marketplace, industrial supplies, wholesale, manufacturers, suppliers, India",
    page: "seo",
    section: "meta",
    description: "Default meta keywords (SEO)",
  },
  {
    key: "seo_og_image",
    content_type: "image",
    value: "/og-image.jpg",
    page: "seo",
    section: "meta",
    description: "Default Open Graph image URL",
  },

  {
    key: "seller_cta_title",
    content_type: "text",
    value: "Become a Seller",
    page: "seller",
    section: "cta",
    description: "Seller signup CTA title",
  },
  {
    key: "seller_cta_subtitle",
    content_type: "text",
    value: "Join our network of trusted suppliers",
    page: "seller",
    section: "cta",
    description: "Seller signup CTA subtitle",
  },
  {
    key: "seller_benefits",
    content_type: "html",
    value:
      "<ul><li>Access to 50,000+ verified buyers</li><li>Free seller dashboard</li><li>Dedicated account manager</li><li>Marketing support</li></ul>",
    page: "seller",
    section: "benefits",
    description: "Seller benefits list (HTML)",
  },

  {
    key: "trust_badge_text",
    content_type: "text",
    value: "100% Verified Sellers",
    page: "global",
    section: "trust",
    description: "Trust badge text",
  },
  {
    key: "trust_guarantee",
    content_type: "text",
    value: "Trade Assurance Protected",
    page: "global",
    section: "trust",
    description: "Trade guarantee text",
  },
  // New Home Page - Hero Section
  {
    key: "home_hero_badge",
    content_type: "text",
    value: "Next-Gen B2B Sourcing",
    page: "home",
    section: "hero",
    description: "Hero section badge text (appears above the title)",
  },
  {
    key: "home_hero_title",
    content_type: "text",
    value: "The Future of Global Trade",
    page: "home",
    section: "hero",
    description: "Main hero title",
  },
  {
    key: "home_hero_subtitle",
    content_type: "text",
    value: "Connect with 10,000+ verified factories. Experience AI-powered sourcing, real-time tracking, and bank-grade security.",
    page: "home",
    section: "hero",
    description: "Hero section description paragraph",
  },
  {
    key: "home_hero_cta_primary",
    content_type: "text",
    value: "Find Suppliers",
    page: "home",
    section: "hero",
    description: "Primary CTA button text in hero",
  },
  {
    key: "home_hero_cta_secondary",
    content_type: "text",
    value: "Get Custom Quote",
    page: "home",
    section: "hero",
    description: "Secondary CTA button text in hero",
  },
  // Trust Bar Features
  {
    key: "home_trust_feature_1_title",
    content_type: "text",
    value: "Verified Suppliers",
    page: "home",
    section: "trust",
    description: "Trust bar feature 1 main text",
  },
  {
    key: "home_trust_feature_1_desc",
    content_type: "text",
    value: "100% Authenticated",
    page: "home",
    section: "trust",
    description: "Trust bar feature 1 description",
  },
  {
    key: "home_trust_feature_2_title",
    content_type: "text",
    value: "Secure Payments",
    page: "home",
    section: "trust",
    description: "Trust bar feature 2 main text",
  },
  {
    key: "home_trust_feature_2_desc",
    content_type: "text",
    value: "Escrow Protected",
    page: "home",
    section: "trust",
    description: "Trust bar feature 2 description",
  },
  {
    key: "home_trust_feature_3_title",
    content_type: "text",
    value: "Trade Assurance",
    page: "home",
    section: "trust",
    description: "Trust bar feature 3 main text",
  },
  {
    key: "home_trust_feature_3_desc",
    content_type: "text",
    value: "On-time Delivery",
    page: "home",
    section: "trust",
    description: "Trust bar feature 3 description",
  },
  {
    key: "home_trust_feature_4_title",
    content_type: "text",
    value: "24/7 Support",
    page: "home",
    section: "trust",
    description: "Trust bar feature 4 main text",
  },
  {
    key: "home_trust_feature_4_desc",
    content_type: "text",
    value: "Dedicated Team",
    page: "home",
    section: "trust",
    description: "Trust bar feature 4 description",
  },
  // How It Works Section
  {
    key: "home_hiw_title",
    content_type: "text",
    value: "How It Works",
    page: "home",
    section: "how_it_works",
    description: "Section title for How It Works",
  },
  {
    key: "home_hiw_subtitle",
    content_type: "text",
    value: "Your journey from search to success in 4 simple steps",
    page: "home",
    section: "how_it_works",
    description: "Subtitle for How It Works section",
  },
  {
    key: "home_hiw_step_1_title",
    content_type: "text",
    value: "Search Products",
    page: "home",
    section: "how_it_works",
    description: "Step 1 title",
  },
  {
    key: "home_hiw_step_1_desc",
    content_type: "text",
    value: "Browse 500K+ products from verified suppliers",
    page: "home",
    section: "how_it_works",
    description: "Step 1 description",
  },
  {
    key: "home_hiw_step_2_title",
    content_type: "text",
    value: "Connect with Suppliers",
    page: "home",
    section: "how_it_works",
    description: "Step 2 title",
  },
  {
    key: "home_hiw_step_2_desc",
    content_type: "text",
    value: "Get instant quotes and negotiate directly",
    page: "home",
    section: "how_it_works",
    description: "Step 2 description",
  },
  {
    key: "home_hiw_step_3_title",
    content_type: "text",
    value: "Place Bulk Orders",
    page: "home",
    section: "how_it_works",
    description: "Step 3 title",
  },
  {
    key: "home_hiw_step_3_desc",
    content_type: "text",
    value: "Secure transactions with trade assurance",
    page: "home",
    section: "how_it_works",
    description: "Step 3 description",
  },
  {
    key: "home_hiw_step_4_title",
    content_type: "text",
    value: "Receive & Grow",
    page: "home",
    section: "how_it_works",
    description: "Step 4 title",
  },
  {
    key: "home_hiw_step_4_desc",
    content_type: "text",
    value: "Reliable delivery with quality guarantee",
    page: "home",
    section: "how_it_works",
    description: "Step 4 description",
  },
  // Stats Section
  {
    key: "home_stats_suppliers_value",
    content_type: "text",
    value: "10000",
    page: "home",
    section: "stats",
    description: "Number of verified suppliers (raw number)",
  },
  {
    key: "home_stats_suppliers_suffix",
    content_type: "text",
    value: "+",
    page: "home",
    section: "stats",
    description: "Suppliers stat suffix (e.g. +)",
  },
  {
    key: "home_stats_suppliers_label",
    content_type: "text",
    value: "Verified Suppliers",
    page: "home",
    section: "stats",
    description: "Suppliers stat label",
  },
  {
    key: "home_stats_products_value",
    content_type: "text",
    value: "500000",
    page: "home",
    section: "stats",
    description: "Number of products listed (raw number)",
  },
  {
    key: "home_stats_products_suffix",
    content_type: "text",
    value: "+",
    page: "home",
    section: "stats",
    description: "Products stat suffix",
  },
  {
    key: "home_stats_products_label",
    content_type: "text",
    value: "Products Listed",
    page: "home",
    section: "stats",
    description: "Products stat label",
  },
  {
    key: "home_stats_buyers_value",
    content_type: "text",
    value: "50000",
    page: "home",
    section: "stats",
    description: "Number of active buyers (raw number)",
  },
  {
    key: "home_stats_buyers_suffix",
    content_type: "text",
    value: "+",
    page: "home",
    section: "stats",
    description: "Buyers stat suffix",
  },
  {
    key: "home_stats_buyers_label",
    content_type: "text",
    value: "Active Buyers",
    page: "home",
    section: "stats",
    description: "Buyers stat label",
  },
  {
    key: "home_stats_orders_value",
    content_type: "text",
    value: "2",
    page: "home",
    section: "stats",
    description: "Orders fulfilled (raw number before suffix)",
  },
  {
    key: "home_stats_orders_suffix",
    content_type: "text",
    value: "M+",
    page: "home",
    section: "stats",
    description: "Orders stat suffix (e.g. M+)",
  },
  {
    key: "home_stats_orders_label",
    content_type: "text",
    value: "Orders Fulfilled",
    page: "home",
    section: "stats",
    description: "Orders stat label",
  },
  // Testimonials Section
  {
    key: "home_testimonials_title",
    content_type: "text",
    value: "Trusted by Thousands",
    page: "home",
    section: "testimonials",
    description: "Testimonials section title",
  },
  {
    key: "home_testimonials_subtitle",
    content_type: "text",
    value: "See what our customers are saying about their SPYAJ experience",
    page: "home",
    section: "testimonials",
    description: "Testimonials section subtitle",
  },
  {
    key: "home_testimonial_1_name",
    content_type: "text",
    value: "Rajesh Sharma",
    page: "home",
    section: "testimonials",
    description: "Testimonial 1 - Person name",
  },
  {
    key: "home_testimonial_1_role",
    content_type: "text",
    value: "Procurement Head, Tata Industries",
    page: "home",
    section: "testimonials",
    description: "Testimonial 1 - Role and company",
  },
  {
    key: "home_testimonial_1_quote",
    content_type: "text",
    value: "SPYAJ revolutionized our procurement process. We reduced costs by 30% while maintaining quality standards.",
    page: "home",
    section: "testimonials",
    description: "Testimonial 1 - Quote text",
  },
  {
    key: "home_testimonial_2_name",
    content_type: "text",
    value: "Priya Patel",
    page: "home",
    section: "testimonials",
    description: "Testimonial 2 - Person name",
  },
  {
    key: "home_testimonial_2_role",
    content_type: "text",
    value: "Supply Chain Manager, Reliance Retail",
    page: "home",
    section: "testimonials",
    description: "Testimonial 2 - Role and company",
  },
  {
    key: "home_testimonial_2_quote",
    content_type: "text",
    value: "The verified supplier network gave us confidence in every transaction. Outstanding platform for B2B trade.",
    page: "home",
    section: "testimonials",
    description: "Testimonial 2 - Quote text",
  },
  {
    key: "home_testimonial_3_name",
    content_type: "text",
    value: "Amit Kumar",
    page: "home",
    section: "testimonials",
    description: "Testimonial 3 - Person name",
  },
  {
    key: "home_testimonial_3_role",
    content_type: "text",
    value: "Director, Mahindra Exports",
    page: "home",
    section: "testimonials",
    description: "Testimonial 3 - Role and company",
  },
  {
    key: "home_testimonial_3_quote",
    content_type: "text",
    value: "From finding suppliers to closing deals, SPYAJ made international sourcing seamless and secure.",
    page: "home",
    section: "testimonials",
    description: "Testimonial 3 - Quote text",
  },
  // FAQ Section
  {
    key: "home_faq_title",
    content_type: "text",
    value: "Frequently Asked Questions",
    page: "home",
    section: "faq",
    description: "FAQ section title",
  },
  {
    key: "home_faq_subtitle",
    content_type: "text",
    value: "Everything you need to know about SPYAJ",
    page: "home",
    section: "faq",
    description: "FAQ section subtitle",
  },
  {
    key: "home_faq_1_q",
    content_type: "text",
    value: "What is the minimum order quantity (MOQ)?",
    page: "home",
    section: "faq",
    description: "FAQ 1 - Question",
  },
  {
    key: "home_faq_1_a",
    content_type: "text",
    value: "MOQ varies by supplier and product. Most suppliers offer flexible MOQs starting from as low as 10 units for samples and 100+ units for bulk orders.",
    page: "home",
    section: "faq",
    description: "FAQ 1 - Answer",
  },
  {
    key: "home_faq_2_q",
    content_type: "text",
    value: "How do I verify supplier authenticity?",
    page: "home",
    section: "faq",
    description: "FAQ 2 - Question",
  },
  {
    key: "home_faq_2_a",
    content_type: "text",
    value: "All suppliers undergo KYC verification, factory audits, and receive badges based on their verification level (Gold, Silver, Bronze). Look for the verified badge on supplier profiles.",
    page: "home",
    section: "faq",
    description: "FAQ 2 - Answer",
  },
  {
    key: "home_faq_3_q",
    content_type: "text",
    value: "What payment methods are accepted?",
    page: "home",
    section: "faq",
    description: "FAQ 3 - Question",
  },
  {
    key: "home_faq_3_a",
    content_type: "text",
    value: "We support bank transfers, credit/debit cards, UPI, and escrow payments. Trade Assurance protects your payment until order delivery.",
    page: "home",
    section: "faq",
    description: "FAQ 3 - Answer",
  },
  {
    key: "home_faq_4_q",
    content_type: "text",
    value: "How long does shipping take?",
    page: "home",
    section: "faq",
    description: "FAQ 4 - Question",
  },
  {
    key: "home_faq_4_a",
    content_type: "text",
    value: "Domestic orders typically take 3-7 business days. International shipping varies by destination (7-21 days). Express options available.",
    page: "home",
    section: "faq",
    description: "FAQ 4 - Answer",
  },
  {
    key: "home_faq_5_q",
    content_type: "text",
    value: "Can I request product samples?",
    page: "home",
    section: "faq",
    description: "FAQ 5 - Question",
  },
  {
    key: "home_faq_5_a",
    content_type: "text",
    value: "Yes! Most suppliers offer sample orders. Use the 'Request Sample' button on product pages to get samples before bulk ordering.",
    page: "home",
    section: "faq",
    description: "FAQ 5 - Answer",
  },
  // Newsletter Section
  {
    key: "home_newsletter_title",
    content_type: "text",
    value: "Stay Updated",
    page: "home",
    section: "newsletter",
    description: "Newsletter section title",
  },
  {
    key: "home_newsletter_subtitle",
    content_type: "text",
    value: "Get the latest industry news, exclusive deals, and sourcing tips delivered to your inbox.",
    page: "home",
    section: "newsletter",
    description: "Newsletter section description",
  },
  {
    key: "home_newsletter_button",
    content_type: "text",
    value: "Subscribe",
    page: "home",
    section: "newsletter",
    description: "Newsletter submit button text",
  },
  {
    key: "home_newsletter_placeholder",
    content_type: "text",
    value: "Enter your email",
    page: "home",
    section: "newsletter",
    description: "Newsletter input placeholder text",
  },
  // CTA Section
  {
    key: "home_cta_title",
    content_type: "text",
    value: "Ready to Transform Your Business Sourcing?",
    page: "home",
    section: "cta",
    description: "Final CTA section title",
  },
  {
    key: "home_cta_subtitle",
    content_type: "text",
    value: "Join thousands of businesses sourcing smarter with SPYAJ. Start your journey today.",
    page: "home",
    section: "cta",
    description: "Final CTA section subtitle",
  },
  {
    key: "home_cta_button_primary",
    content_type: "text",
    value: "Get Started Free",
    page: "home",
    section: "cta",
    description: "Primary CTA button text",
  },
  {
    key: "home_cta_button_secondary",
    content_type: "text",
    value: "Schedule a Demo",
    page: "home",
    section: "cta",
    description: "Secondary CTA button text",
  },
  // Buyer Benefits Section
  {
    key: "home_benefits_title",
    content_type: "text",
    value: "Why Buyers Choose SPYAJ",
    page: "home",
    section: "benefits",
    description: "Buyer benefits section title",
  },
  {
    key: "home_benefits_subtitle",
    content_type: "text",
    value: "Everything you need for smart B2B sourcing under one platform",
    page: "home",
    section: "benefits",
    description: "Buyer benefits section subtitle",
  },
  {
    key: "home_benefit_1_title",
    content_type: "text",
    value: "Bulk Pricing",
    page: "home",
    section: "benefits",
    description: "Benefit 1 title",
  },
  {
    key: "home_benefit_1_desc",
    content_type: "text",
    value: "Get wholesale rates directly from manufacturers",
    page: "home",
    section: "benefits",
    description: "Benefit 1 description",
  },
  {
    key: "home_benefit_2_title",
    content_type: "text",
    value: "Trade Protection",
    page: "home",
    section: "benefits",
    description: "Benefit 2 title",
  },
  {
    key: "home_benefit_2_desc",
    content_type: "text",
    value: "100% money-back guarantee on every order",
    page: "home",
    section: "benefits",
    description: "Benefit 2 description",
  },
  {
    key: "home_benefit_3_title",
    content_type: "text",
    value: "Fast Quotes",
    page: "home",
    section: "benefits",
    description: "Benefit 3 title",
  },
  {
    key: "home_benefit_3_desc",
    content_type: "text",
    value: "Receive multiple quotes within 24 hours",
    page: "home",
    section: "benefits",
    description: "Benefit 3 description",
  },
  {
    key: "home_benefit_4_title",
    content_type: "text",
    value: "Quality Assured",
    page: "home",
    section: "benefits",
    description: "Benefit 4 title",
  },
  {
    key: "home_benefit_4_desc",
    content_type: "text",
    value: "Pre-shipment inspection on bulk orders",
    page: "home",
    section: "benefits",
    description: "Benefit 4 description",
  },
  {
    key: "home_benefit_5_title",
    content_type: "text",
    value: "Easy Returns",
    page: "home",
    section: "benefits",
    description: "Benefit 5 title",
  },
  {
    key: "home_benefit_5_desc",
    content_type: "text",
    value: "Hassle-free returns for defective products",
    page: "home",
    section: "benefits",
    description: "Benefit 5 description",
  },
  {
    key: "home_benefit_6_title",
    content_type: "text",
    value: "Credit Terms",
    page: "home",
    section: "benefits",
    description: "Benefit 6 title",
  },
  {
    key: "home_benefit_6_desc",
    content_type: "text",
    value: "Flexible payment terms for trusted buyers",
    page: "home",
    section: "benefits",
    description: "Benefit 6 description",
  },
  // Industries Section
  {
    key: "home_industries_title",
    content_type: "text",
    value: "Explore Industries",
    page: "home",
    section: "industries",
    description: "Industries section title",
  },
  {
    key: "home_industries_subtitle",
    content_type: "text",
    value: "Find verified suppliers across 50+ industries. From raw materials to finished goods.",
    page: "home",
    section: "industries",
    description: "Industries section subtitle",
  },
  {
    key: "home_industries_badge",
    content_type: "text",
    value: "50+ Industries",
    page: "home",
    section: "industries",
    description: "Industries section badge text",
  },
  // RFQ Section on Home
  {
    key: "home_rfq_title",
    content_type: "text",
    value: "Get Custom Quotes in 24 Hours",
    page: "home",
    section: "rfq",
    description: "RFQ section title on homepage",
  },
  {
    key: "home_rfq_subtitle",
    content_type: "text",
    value: "Tell us what you need. Our network of 10,000+ suppliers will compete to offer you the best prices.",
    page: "home",
    section: "rfq",
    description: "RFQ section subtitle on homepage",
  },
  {
    key: "home_rfq_form_title",
    content_type: "text",
    value: "Request for Quote",
    page: "home",
    section: "rfq",
    description: "RFQ form title on homepage",
  },
  {
    key: "home_rfq_button",
    content_type: "text",
    value: "Get Free Quotes",
    page: "home",
    section: "rfq",
    description: "RFQ submit button text on homepage",
  },
];

type ContentType = "text" | "html" | "image" | "json";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<{
    key: string;
    content_type: ContentType;
    value: string;
    page: string;
    section: string;
    description: string;
  }>({
    key: "",
    content_type: "text",
    value: "",
    page: "",
    section: "",
    description: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from("site_content")
        .select("*")
        .order("page")
        .order("section")
        .order("key");

      if (error) throw error;

      if (!data || data.length === 0) {
        const mockContent = defaultContentItems.map((item, index) => ({
          ...item,
          id: `mock-${index}`,
        }));
        setContent(mockContent);
      } else {
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);

      const mockContent = defaultContentItems.map((item, index) => ({
        ...item,
        id: `mock-${index}`,
      }));
      setContent(mockContent);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (id: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (item: SiteContent) => {
    setSaving(item.id);
    try {
      const newValue = editedValues[item.id] ?? item.value;

      if (item.id.startsWith("mock-")) {
        const { error } = await supabaseAdmin.from("site_content").insert({
          key: item.key,
          content_type: item.content_type,
          value: newValue,
          page: item.page,
          section: item.section,
          description: item.description,
        });

        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin
          .from("site_content")
          .update({ value: newValue })
          .eq("id", item.id);

        if (error) throw error;
      }

      setContent((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, value: newValue } : c)),
      );

      setEditedValues((prev) => {
        const newValues = { ...prev };
        delete newValues[item.id];
        return newValues;
      });

      fetchContent();
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const handleAddNew = async () => {
    if (!newItem.key || !newItem.value) {
      alert("Key and value are required");
      return;
    }

    try {
      const { error } = await supabaseAdmin.from("site_content").insert({
        key: newItem.key,
        content_type: newItem.content_type,
        value: newItem.value,
        page: newItem.page || null,
        section: newItem.section || null,
        description: newItem.description || null,
      });

      if (error) throw error;

      setShowAddModal(false);
      setNewItem({
        key: "",
        content_type: "text",
        value: "",
        page: "",
        section: "",
        description: "",
      });
      fetchContent();
    } catch (error) {
      console.error("Failed to add:", error);
      alert("Failed to add content. Key might already exist.");
    }
  };

  const groupedContent = content.reduce(
    (acc, item) => {
      const page = item.page || "other";
      if (!acc[page]) acc[page] = [];
      acc[page].push(item);
      return acc;
    },
    {} as Record<string, SiteContent[]>,
  );

  const filteredGroups = Object.entries(groupedContent).filter(([_, items]) =>
    items.some(
      (item) =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.value.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const pageLabels: Record<string, string> = {
    global: "🌐 Global Settings",
    landing: "🏠 Landing Page",
    about: "ℹ️ About Page",
    contact: "📞 Contact Page",
    social: "📱 Social Media",
    seo: "🔍 SEO Settings",
    seller: "🏪 Seller Pages",
    other: "📁 Other",
  };

  return (
    <div className="space-y-6">
      { }
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Content</h1>
          <p className="text-slate-500">
            Edit website text, links, and content ({content.length} items)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditedValues({});
              fetchContent();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Content
          </button>
        </div>
      </div>

      { }
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(groupedContent).map(([page, items]) => (
          <div
            key={page}
            className="bg-white p-3 rounded-xl border border-slate-200 text-center"
          >
            <p className="text-xs font-medium text-slate-500 capitalize">
              {page}
            </p>
            <p className="text-xl font-bold text-slate-900">{items.length}</p>
          </div>
        ))}
      </div>

      { }
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search content by key, description, or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      { }
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Settings className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No content found
          </h3>
          <p className="text-slate-500">Try adjusting your search</p>
        </div>
      ) : (
        filteredGroups.map(([page, items]) => (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            { }
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                {pageLabels[page] || page}
              </h2>
              <span className="text-sm text-slate-500">
                {items.length} items
              </span>
            </div>

            { }
            <div className="divide-y divide-slate-100">
              {items
                .filter(
                  (item) =>
                    item.key
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.description
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.value
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((item) => {
                  const Icon = contentTypeIcons[item.content_type];
                  const hasChanges =
                    editedValues[item.id] !== undefined &&
                    editedValues[item.id] !== item.value;

                  return (
                    <div key={item.id} className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        { }
                        <div className="sm:w-56 flex-shrink-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`p-1 rounded ${contentTypeColors[item.content_type]}`}
                            >
                              <Icon size={14} />
                            </span>
                            <code className="text-sm font-mono text-slate-700 truncate">
                              {item.key}
                            </code>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {item.description || "No description"}
                          </p>
                          {item.section && (
                            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-100 rounded">
                              {item.section}
                            </span>
                          )}
                        </div>

                        { }
                        <div className="flex-1">
                          {item.content_type === "html" ? (
                            <textarea
                              value={editedValues[item.id] ?? item.value}
                              onChange={(e) =>
                                handleValueChange(item.id, e.target.value)
                              }
                              rows={4}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                            />
                          ) : item.content_type === "image" ? (
                            <div className="space-y-2">
                              <input
                                type="url"
                                value={editedValues[item.id] ?? item.value}
                                onChange={(e) =>
                                  handleValueChange(item.id, e.target.value)
                                }
                                placeholder="Image URL..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                              />
                              {(editedValues[item.id] ?? item.value) && (
                                <img
                                  src={editedValues[item.id] ?? item.value}
                                  alt=""
                                  className="h-16 rounded-lg object-cover"
                                />
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={editedValues[item.id] ?? item.value}
                              onChange={(e) =>
                                handleValueChange(item.id, e.target.value)
                              }
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          )}
                        </div>

                        { }
                        <button
                          onClick={() => handleSave(item)}
                          disabled={!hasChanges || saving === item.id}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0 ${hasChanges
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                          {saving === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : hasChanges ? (
                            <Save size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          <span className="hidden sm:inline">
                            {saving === item.id
                              ? "Saving"
                              : hasChanges
                                ? "Save"
                                : "Saved"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        ))
      )}

      { }
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  Add New Content
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Key *
                  </label>
                  <input
                    type="text"
                    value={newItem.key}
                    onChange={(e) =>
                      setNewItem({ ...newItem, key: e.target.value })
                    }
                    placeholder="e.g. hero_title"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Page
                    </label>
                    <select
                      value={newItem.page}
                      onChange={(e) =>
                        setNewItem({ ...newItem, page: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="">Select page</option>
                      <option value="global">Global</option>
                      <option value="landing">Landing</option>
                      <option value="about">About</option>
                      <option value="contact">Contact</option>
                      <option value="social">Social</option>
                      <option value="seo">SEO</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Section
                    </label>
                    <input
                      type="text"
                      value={newItem.section}
                      onChange={(e) =>
                        setNewItem({ ...newItem, section: e.target.value })
                      }
                      placeholder="e.g. hero"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newItem.content_type}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        content_type: e.target.value as
                          | "text"
                          | "html"
                          | "image"
                          | "json",
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="image">Image URL</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Value *
                  </label>
                  {newItem.content_type === "html" ? (
                    <textarea
                      value={newItem.value}
                      onChange={(e) =>
                        setNewItem({ ...newItem, value: e.target.value })
                      }
                      rows={4}
                      placeholder="Enter HTML content..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={newItem.value}
                      onChange={(e) =>
                        setNewItem({ ...newItem, value: e.target.value })
                      }
                      placeholder="Enter value..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    placeholder="What is this content for?"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-slate-700 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Content
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
