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
  landing: Globe,
  about: FileText,
  contact: Phone,
  social: Share2,
  seo: Settings,
};

const defaultContentItems: Omit<SiteContent, "id">[] = [
  {
    key: "hero_title",
    content_type: "text",
    value: "Connect. Trade. Grow.",
    page: "landing",
    section: "hero",
    description: "Main hero section title",
  },
  {
    key: "hero_subtitle",
    content_type: "text",
    value: "India's Most Trusted B2B Marketplace",
    page: "landing",
    section: "hero",
    description: "Hero section subtitle",
  },
  {
    key: "hero_cta_primary",
    content_type: "text",
    value: "Explore Products",
    page: "landing",
    section: "hero",
    description: "Primary CTA button text",
  },
  {
    key: "hero_cta_secondary",
    content_type: "text",
    value: "Get a Quote",
    page: "landing",
    section: "hero",
    description: "Secondary CTA button text",
  },
  {
    key: "hero_stats_buyers",
    content_type: "text",
    value: "50,000+",
    page: "landing",
    section: "hero",
    description: "Number of active buyers",
  },
  {
    key: "hero_stats_sellers",
    content_type: "text",
    value: "10,000+",
    page: "landing",
    section: "hero",
    description: "Number of verified sellers",
  },
  {
    key: "hero_stats_products",
    content_type: "text",
    value: "1M+",
    page: "landing",
    section: "hero",
    description: "Number of products",
  },

  {
    key: "features_title",
    content_type: "text",
    value: "Why Choose SPYAJ?",
    page: "landing",
    section: "features",
    description: "Features section title",
  },
  {
    key: "features_subtitle",
    content_type: "text",
    value: "Experience the future of B2B trading",
    page: "landing",
    section: "features",
    description: "Features section subtitle",
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
      {}
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

      {}
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

      {}
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

      {}
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
            {}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                {pageLabels[page] || page}
              </h2>
              <span className="text-sm text-slate-500">
                {items.length} items
              </span>
            </div>

            {}
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
                        {}
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

                        {}
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

                        {}
                        <button
                          onClick={() => handleSave(item)}
                          disabled={!hasChanges || saving === item.id}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0 ${
                            hasChanges
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

      {}
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
