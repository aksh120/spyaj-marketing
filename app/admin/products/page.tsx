"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Loader2,
  X,
  Save,
  Star,
  Eye,
  Filter,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/db";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: string;
  price_numeric: number | null;
  currency: string;
  unit: string | null;
  min_order_qty: number;
  category_id: string | null;
  seller_id: string | null;
  images: { url: string; alt?: string }[];
  rating: number;
  reviews_count: number;
  orders_count: number;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  category?: { id: string; name: string };
  seller?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface Seller {
  id: string;
  name: string;
}

const defaultProduct = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  price: "",
  price_numeric: 0,
  currency: "INR",
  unit: "piece",
  min_order_qty: 1,
  category_id: "",
  seller_id: "",
  images: [] as { url: string; alt?: string }[],
  badge: "",
  is_featured: false,
  is_active: true,
};

const badges = ["", "Best Seller", "Trending", "New", "Top Rated", "Hot Deal"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(defaultProduct);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabaseAdmin
        .from("products")
        .select(
          `
          *,
          category:categories(id, name),
          seller:sellers(id, name)
        `,
        )
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      const { data: catData } = await supabaseAdmin
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
      setCategories(catData || []);

      const { data: sellerData } = await supabaseAdmin
        .from("sellers")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
      setSellers(sellerData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
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

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        short_description: product.short_description || "",
        price: product.price,
        price_numeric: product.price_numeric || 0,
        currency: product.currency,
        unit: product.unit || "piece",
        min_order_qty: product.min_order_qty,
        category_id: product.category_id || "",
        seller_id: product.seller_id || "",
        images: product.images || [],
        badge: product.badge || "",
        is_featured: product.is_featured,
        is_active: product.is_active,
      });
    } else {
      setEditingProduct(null);
      setFormData(defaultProduct);
    }
    setImageUrl("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(defaultProduct);
    setImageUrl("");
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, { url: imageUrl.trim() }],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (!formData.price.trim()) {
      alert("Price is required");
      return;
    }

    setSaving(true);
    try {
      const slug = formData.slug || generateSlug(formData.name);

      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
        short_description: formData.short_description.trim() || null,
        price: formData.price.trim(),
        price_numeric: Number(formData.price_numeric) || null,
        currency: formData.currency,
        unit: formData.unit || null,
        min_order_qty: Number(formData.min_order_qty) || 1,
        images: formData.images,
        badge: formData.badge || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      };

      if (formData.category_id && formData.category_id.length > 0) {
        payload.category_id = formData.category_id;
      } else {
        payload.category_id = null;
      }

      if (formData.seller_id && formData.seller_id.length > 0) {
        payload.seller_id = formData.seller_id;
      } else {
        payload.seller_id = null;
      }

      console.log("[Products] Saving payload:", payload);

      if (editingProduct) {
        const { error } = await supabaseAdmin
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);

        if (error) {
          console.error("[Products] Update error:", error);
          throw error;
        }
      } else {
        const { data, error } = await supabaseAdmin
          .from("products")
          .insert(payload)
          .select();

        if (error) {
          console.error("[Products] Insert error:", error);
          throw error;
        }
        console.log("[Products] Inserted:", data);
      }

      handleCloseModal();
      fetchData();
    } catch (error: unknown) {
      console.error("Failed to save product:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || "Unknown error";
      alert(`Failed to save product: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || product.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500">
            Manage your product catalog ({products.length} products)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Add Product
        </motion.button>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.filter((p) => p.is_active).length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="text-sm font-medium text-yellow-600">Featured</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.filter((p) => p.is_featured).length}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Inactive</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.filter((p) => !p.is_active).length}
          </p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 mb-4">
              {products.length === 0
                ? "Start by adding your first product"
                : "Try adjusting your search or filters"}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700 hidden lg:table-cell">
                    Seller
                  </th>
                  <th className="text-left p-4 font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="text-center p-4 font-semibold text-slate-700 hidden sm:table-cell">
                    Rating
                  </th>
                  <th className="text-center p-4 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-right p-4 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            product.name[0]
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-slate-600">
                        {product.category?.name || "-"}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-600">
                        {product.seller?.name || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-900">
                        {product.price}
                      </span>
                      {product.unit && (
                        <span className="text-xs text-slate-500 ml-1">
                          /{product.unit}
                        </span>
                      )}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                        {product.is_featured && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
                        >
                          <Eye size={16} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-2xl z-50 w-full max-w-md"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Delete Product?
              </h3>
              <p className="text-slate-600 mb-4">
                This action cannot be undone. The product will be permanently
                removed.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              {}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Name *
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
                      placeholder="e.g. Industrial Steel Pipe"
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
                      placeholder="industrial-steel-pipe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        short_description: e.target.value,
                      })
                    }
                    placeholder="Brief one-line description..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Detailed product description..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="₹1,25,000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">Kg</option>
                      <option value="meter">Meter</option>
                      <option value="set">Set</option>
                      <option value="box">Box</option>
                      <option value="ton">Ton</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Min Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.min_order_qty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          min_order_qty: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Badge
                    </label>
                    <select
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {badges.map((badge) => (
                        <option key={badge} value={badge}>
                          {badge || "None"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Seller
                    </label>
                    <select
                      value={formData.seller_id}
                      onChange={(e) =>
                        setFormData({ ...formData, seller_id: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="">Select Seller</option>
                      {sellers.map((seller) => (
                        <option key={seller.id} value={seller.id}>
                          {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Images
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      Add
                    </button>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100"
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Featured</span>
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
                  {saving ? "Saving..." : editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
