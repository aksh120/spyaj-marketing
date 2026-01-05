"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Loader2,
  Star,
  CheckCircle,
  MapPin,
  ChevronRight,
  X,
  Save,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db";

interface Seller {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  is_verified: boolean;
  rating: number;
  location: string | null;
  joined_year: number | null;
  is_active: boolean;
  contact_email: string | null;
  contact_phone: string | null;
}

const tierColors: Record<string, { bg: string; text: string; border: string }> =
  {
    Bronze: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    Silver: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
    },
    Gold: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
    },
    Platinum: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
    },
  };

type SellerTier = "Bronze" | "Silver" | "Gold" | "Platinum";

const defaultSeller: {
  name: string;
  slug: string;
  description: string;
  tier: SellerTier;
  is_verified: boolean;
  rating: number;
  location: string;
  joined_year: number;
  is_active: boolean;
  contact_email: string;
  contact_phone: string;
} = {
  name: "",
  slug: "",
  description: "",
  tier: "Bronze",
  is_verified: false,
  rating: 0,
  location: "",
  joined_year: new Date().getFullYear(),
  is_active: true,
  contact_email: "",
  contact_phone: "",
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [formData, setFormData] = useState(defaultSeller);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from("sellers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleOpenModal = (seller?: Seller) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({
        name: seller.name,
        slug: seller.slug,
        description: seller.description || "",
        tier: seller.tier,
        is_verified: seller.is_verified,
        rating: seller.rating,
        location: seller.location || "",
        joined_year: seller.joined_year || new Date().getFullYear(),
        is_active: seller.is_active,
        contact_email: seller.contact_email || "",
        contact_phone: seller.contact_phone || "",
      });
    } else {
      setEditingSeller(null);
      setFormData(defaultSeller);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSeller(null);
    setFormData(defaultSeller);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Seller name is required");
      return;
    }

    setSaving(true);
    try {
      const slug = formData.slug || generateSlug(formData.name);
      const payload = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
        tier: formData.tier,
        is_verified: formData.is_verified,
        rating: Number(formData.rating) || 0,
        location: formData.location.trim() || null,
        joined_year: Number(formData.joined_year) || null,
        is_active: formData.is_active,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
      };

      if (editingSeller) {
        const { error } = await supabaseAdmin
          .from("sellers")
          .update(payload)
          .eq("id", editingSeller.id);

        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin.from("sellers").insert(payload);

        if (error) throw error;
      }

      handleCloseModal();
      fetchSellers();
    } catch (error) {
      console.error("Failed to save seller:", error);
      alert("Failed to save seller. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from("sellers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchSellers();
    } catch (error) {
      console.error("Failed to delete seller:", error);
      alert("Failed to delete seller. Please try again.");
    }
  };

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sellers</h1>
          <p className="text-slate-500">Manage verified supplier profiles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Add Seller
        </motion.button>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["Bronze", "Silver", "Gold", "Platinum"].map((tier) => (
          <div
            key={tier}
            className={`p-4 rounded-xl border ${tierColors[tier].border} ${tierColors[tier].bg}`}
          >
            <p className={`text-sm font-medium ${tierColors[tier].text}`}>
              {tier}
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {sellers.filter((s) => s.tier === tier).length}
            </p>
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
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-slate-200">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No sellers found
            </h3>
            <p className="text-slate-500 mb-4">
              {sellers.length === 0
                ? "Start by adding your first seller"
                : "Try adjusting your search"}
            </p>
            {sellers.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add First Seller
              </button>
            )}
          </div>
        ) : (
          filteredSellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {seller.name[0]}
                </div>

                {}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900">
                      {seller.name}
                    </h3>
                    {seller.is_verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[seller.tier].bg} ${tierColors[seller.tier].text}`}
                    >
                      {seller.tier}
                    </span>
                    {!seller.is_active && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                    {seller.description || "No description"}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {seller.rating}
                    </span>
                    {seller.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {seller.location}
                      </span>
                    )}
                    {seller.joined_year && (
                      <span>Since {seller.joined_year}</span>
                    )}
                  </div>
                </div>

                {}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(seller)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(seller.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {}
              {deleteConfirm === seller.id && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-2">
                    Delete &ldquo;{seller.name}&rdquo;? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(seller.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-white text-slate-700 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {}
      <AnimatePresence>
        {showModal && (
          <>
            {}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingSeller ? "Edit Seller" : "Add New Seller"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              {}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Seller Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      placeholder="e.g. Global Metals Co."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="global-metals-co"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Brief description of the seller..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tier
                    </label>
                    <select
                      value={formData.tier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tier: e.target.value as Seller["tier"],
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Joined Year
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.joined_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          joined_year:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_email: e.target.value,
                        })
                      }
                      placeholder="contact@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_phone: e.target.value,
                        })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_verified: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">
                      Verified Seller
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              {}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Saving..." : editingSeller ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
