"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/db";

interface SiteContent {
  id: string;
  key: string;
  value: string;
  content_type: string;
  page: string | null;
  section: string | null;
}

const defaultContent: Record<string, string> = {
  home_hero_badge: "Next-Gen B2B Sourcing",
  home_hero_title: "The Future of Global Trade",
  home_hero_subtitle:
    "Connect with 10,000+ verified factories. Experience AI-powered sourcing, real-time tracking, and bank-grade security.",
  home_hero_cta_primary: "Find Suppliers",
  home_hero_cta_secondary: "Get Custom Quote",

  home_trust_feature_1_title: "Verified Suppliers",
  home_trust_feature_1_desc: "100% Authenticated",
  home_trust_feature_2_title: "Secure Payments",
  home_trust_feature_2_desc: "Escrow Protected",
  home_trust_feature_3_title: "Trade Assurance",
  home_trust_feature_3_desc: "On-time Delivery",
  home_trust_feature_4_title: "24/7 Support",
  home_trust_feature_4_desc: "Dedicated Team",

  home_hiw_title: "How It Works",
  home_hiw_subtitle: "Your journey from search to success in 4 simple steps",
  home_hiw_step_1_title: "Search Products",
  home_hiw_step_1_desc: "Browse 500K+ products from verified suppliers",
  home_hiw_step_2_title: "Connect with Suppliers",
  home_hiw_step_2_desc: "Get instant quotes and negotiate directly",
  home_hiw_step_3_title: "Place Bulk Orders",
  home_hiw_step_3_desc: "Secure transactions with trade assurance",
  home_hiw_step_4_title: "Receive & Grow",
  home_hiw_step_4_desc: "Reliable delivery with quality guarantee",

  home_stats_suppliers_value: "10000",
  home_stats_suppliers_suffix: "+",
  home_stats_suppliers_label: "Verified Suppliers",
  home_stats_products_value: "500000",
  home_stats_products_suffix: "+",
  home_stats_products_label: "Products Listed",
  home_stats_buyers_value: "50000",
  home_stats_buyers_suffix: "+",
  home_stats_buyers_label: "Active Buyers",
  home_stats_orders_value: "2",
  home_stats_orders_suffix: "M+",
  home_stats_orders_label: "Orders Fulfilled",

  home_testimonials_title: "Trusted by Thousands",
  home_testimonials_subtitle:
    "See what our customers are saying about their SPYAJ experience",
  home_testimonial_1_name: "Rajesh Sharma",
  home_testimonial_1_role: "Procurement Head, Tata Industries",
  home_testimonial_1_quote:
    "SPYAJ revolutionized our procurement process. We reduced costs by 30% while maintaining quality standards.",
  home_testimonial_2_name: "Priya Patel",
  home_testimonial_2_role: "Supply Chain Manager, Reliance Retail",
  home_testimonial_2_quote:
    "The verified supplier network gave us confidence in every transaction. Outstanding platform for B2B trade.",
  home_testimonial_3_name: "Amit Kumar",
  home_testimonial_3_role: "Director, Mahindra Exports",
  home_testimonial_3_quote:
    "From finding suppliers to closing deals, SPYAJ made international sourcing seamless and secure.",

  home_faq_title: "Frequently Asked Questions",
  home_faq_subtitle: "Everything you need to know about SPYAJ",
  home_faq_1_q: "What is the minimum order quantity (MOQ)?",
  home_faq_1_a:
    "MOQ varies by supplier and product. Most suppliers offer flexible MOQs starting from as low as 10 units for samples and 100+ units for bulk orders.",
  home_faq_2_q: "How do I verify supplier authenticity?",
  home_faq_2_a:
    "All suppliers undergo KYC verification, factory audits, and receive badges based on their verification level (Gold, Silver, Bronze). Look for the verified badge on supplier profiles.",
  home_faq_3_q: "What payment methods are accepted?",
  home_faq_3_a:
    "We support bank transfers, credit/debit cards, UPI, and escrow payments. Trade Assurance protects your payment until order delivery.",
  home_faq_4_q: "How long does shipping take?",
  home_faq_4_a:
    "Domestic orders typically take 3-7 business days. International shipping varies by destination (7-21 days). Express options available.",
  home_faq_5_q: "Can I request product samples?",
  home_faq_5_a:
    "Yes! Most suppliers offer sample orders. Use the 'Request Sample' button on product pages to get samples before bulk ordering.",

  home_newsletter_title: "Stay Updated",
  home_newsletter_subtitle:
    "Get the latest industry news, exclusive deals, and sourcing tips delivered to your inbox.",
  home_newsletter_button: "Subscribe",
  home_newsletter_placeholder: "Enter your email",

  home_cta_title: "Ready to Transform Your Business Sourcing?",
  home_cta_subtitle:
    "Join thousands of businesses sourcing smarter with SPYAJ. Start your journey today.",
  home_cta_button_primary: "Get Started Free",
  home_cta_button_secondary: "Schedule a Demo",

  home_benefits_title: "Why Buyers Choose SPYAJ",
  home_benefits_subtitle:
    "Everything you need for smart B2B sourcing under one platform",
  home_benefit_1_title: "Bulk Pricing",
  home_benefit_1_desc: "Get wholesale rates directly from manufacturers",
  home_benefit_2_title: "Trade Protection",
  home_benefit_2_desc: "100% money-back guarantee on every order",
  home_benefit_3_title: "Fast Quotes",
  home_benefit_3_desc: "Receive multiple quotes within 24 hours",
  home_benefit_4_title: "Quality Assured",
  home_benefit_4_desc: "Pre-shipment inspection on bulk orders",
  home_benefit_5_title: "Easy Returns",
  home_benefit_5_desc: "Hassle-free returns for defective products",
  home_benefit_6_title: "Credit Terms",
  home_benefit_6_desc: "Flexible payment terms for trusted buyers",

  home_industries_title: "Explore Industries",
  home_industries_subtitle:
    "Find verified suppliers across 50+ industries. From raw materials to finished goods.",
  home_industries_badge: "50+ Industries",

  home_rfq_title: "Get Custom Quotes in 24 Hours",
  home_rfq_subtitle:
    "Tell us what you need. Our network of 10,000+ suppliers will compete to offer you the best prices.",
  home_rfq_form_title: "Request for Quote",
  home_rfq_button: "Get Free Quotes",

  home_suppliers_title: "Featured Suppliers",
  home_suppliers_subtitle:
    "Top-rated verified suppliers with excellent track records",
  home_suppliers_badge: "⭐ Top Rated",

  home_verification_title: "Supplier Verification",
  home_verification_subtitle:
    "Every supplier is verified through our rigorous multi-level process",

  home_partners_title: "Trusted by Leading Brands",

  home_livetrade_title: "Live Trade Activity",
  home_livetrade_subtitle: "Real-time transactions happening on SPYAJ",

  contact_hero_title: "Get in Touch",
  contact_hero_subtitle:
    "Connect. Trade. Grow. - Let us help you connect with the right business partners.",

  contact_method_1_title: "Live Chat",
  contact_method_1_desc: "Available 24/7 for urgent business support.",
  contact_method_1_action: "Start Chat",
  contact_method_2_title: "Email Support",
  contact_method_2_desc: "support@spyaj.com - Response within 24h.",
  contact_method_2_action: "Send Email",
  contact_method_3_title: "Phone Support",
  contact_method_3_desc: "+91 (123) 456-7890 - Trade assistance.",
  contact_method_3_action: "Call Now",
  contact_method_4_title: "Business Hours",
  contact_method_4_desc: "Mon - Fri: 9 AM to 6 PM (IST).",
  contact_method_4_action: "View Schedule",

  contact_address_title: "Visit Our Headquarters",
  contact_company_name: "SPYAJ Marketing Pvt. Ltd.",
  contact_address_line1: "123 Business, Industrial Zone,",
  contact_address_line2: "Pune, Maharashtra, India - 364001",

  contact_form_title: "Send Us a Message",
  contact_form_subtitle:
    "We'd love to hear from you! Fill out the form and we'll get back to you shortly.",
  contact_form_name_label: "Your Name",
  contact_form_email_label: "Email Address",
  contact_form_subject_label: "Subject",
  contact_form_message_label: "Your Message",
  contact_form_submit_button: "Send Message",
  contact_form_success_message: "Message Sent Successfully!",
  contact_form_success_description: "We'll get back to you within 24 hours.",

  contact_faq_title: "Frequently Asked Questions",
  contact_faq_1_q: "How do I become a seller?",
  contact_faq_1_a:
    "Register on our platform, complete verification, and start listing your products.",
  contact_faq_2_q: "What payment methods are accepted?",
  contact_faq_2_a:
    "We accept bank transfers, cards, UPI, and escrow payments for secure transactions.",
  contact_faq_3_q: "How long does shipping take?",
  contact_faq_3_a:
    "Domestic orders: 3-7 days. International: 10-21 days depending on destination.",

  global_email: "support@spyaj.com",
  global_phone: "+91 (123) 456-7890",
  global_whatsapp: "+919876543210",
  global_address:
    "123 Business Park, Industrial Zone, Pune, Maharashtra, India - 364001",
};

export function useSiteContent(page: string | string[] = "home") {
  const [content, setContent] =
    useState<Record<string, string>>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pages = Array.isArray(page) ? page : [page];

        let query = supabase.from("site_content").select("key, value");

        if (pages.length > 1) {
          query = query.in("page", pages);
        } else {
          query = query.eq("page", pages[0]);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Failed to fetch site content:", error);
          return;
        }

        if (data && data.length > 0) {
          const contentMap: Record<string, string> = { ...defaultContent };
          data.forEach((item: { key: string; value: string }) => {
            contentMap[item.key] = item.value;
          });
          setContent(contentMap);
        }
      } catch (error) {
        console.error("Error fetching site content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [Array.isArray(page) ? page.join(",") : page]);

  const get = (key: string, fallback?: string): string => {
    return content[key] || fallback || defaultContent[key] || "";
  };

  return { content, loading, get };
}

export default useSiteContent;
