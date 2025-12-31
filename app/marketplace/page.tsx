"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  ChevronDown,
  CheckCircle2,
  X,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";
import { products, allCategories as categories } from "@/lib/data";
import { useCart } from "@/context/CartContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "orders", label: "Most Orders" },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const foundCategory = categories.find((c) => slugify(c) === categorySlug);
      if (foundCategory) setSelectedCategory(foundCategory);
    }

    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);
  const [sortBy, setSortBy] = useState("recommended");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartNotification, setCartNotification] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${slugify(product.seller || "Verified Seller")}/${slugify(product.name)}`);
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller || "Verified Seller",
      category: product.category,
    });
    setCartNotification(`${product.name} added to cart!`);
    setTimeout(() => setCartNotification(null), 3000);
  };

  const filteredProducts = products
    .filter(
      (p) =>
        selectedCategory === "All" ||
        p.category === selectedCategory ||
        p.category.includes(selectedCategory) ||
        selectedCategory.includes(p.category),
    )
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-low")
        return (
          parseInt(a.price.replace(/[^\d]/g, "")) -
          parseInt(b.price.replace(/[^\d]/g, ""))
        );
      if (sortBy === "price-high")
        return (
          parseInt(b.price.replace(/[^\d]/g, "")) -
          parseInt(a.price.replace(/[^\d]/g, ""))
        );
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "orders") return b.orders - a.orders;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 pt-[80px] md:pt-[100px]">
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 50 }}
            className="fixed top-24 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{cartNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            B2B Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground"
          >
            Browse thousands of products from certified global sellers.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 md:gap-3 w-full md:w-auto"
        >
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border-2 border-border rounded-xl py-2 md:py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-2 md:p-2.5 border-2 rounded-xl transition-all md:hidden",
              isFilterOpen
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted",
            )}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background border-l border-border shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5 text-primary" /> Filters
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h4 className="font-bold mb-3 text-sm flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary" /> Categories
                  </h4>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between",
                          selectedCategory === cat
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted bg-muted/30"
                        )}
                      >
                        {cat}
                        {selectedCategory === cat && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3 text-sm flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" /> Price Range
                  </h4>
                  <div className="px-1 space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-sm font-medium bg-muted/50 p-2 rounded-lg border border-border">
                      <span>₹0</span>
                      <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-card">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-6 md:gap-10" ref={containerRef}>
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:block w-64 space-y-6"
        >
          <div className="bg-card border-2 border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-primary" /> Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-muted",
                  )}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Price Range
            </h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>₹0</span>
                <span className="font-bold text-foreground">
                  ₹{priceRange[1].toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Now
            </h3>
            <div className="space-y-2 text-sm">
              {["Solar Panels", "CNC Machines", "Cotton Fabric"].map(
                (item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    {item}
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </motion.aside>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b"
          >
            <p className="text-xs md:text-sm font-medium">
              <span className="text-primary font-bold">
                {filteredProducts.length}
              </span>{" "}
              products found
            </p>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <ListIcon className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border-2 border-border rounded-lg bg-card">
                <span className="text-[10px] md:text-xs text-muted-foreground">
                  Sort:
                </span>
                <select
                  className="bg-transparent text-xs md:text-sm font-semibold outline-none border-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={cn(
              "gap-3 md:gap-6",
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col",
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className={cn(
                    "group bg-background border-2 border-border rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 relative",
                    hoveredProduct === product.id &&
                    "border-primary/50 shadow-xl shadow-primary/10",
                  )}
                >
                  <Link
                    href={`/product/${slugify(product.seller || "Verified Seller")}/${slugify(product.name)}`}
                    className="absolute inset-0 z-0"
                  />
                  <div className="aspect-square bg-gradient-to-br from-primary/5 via-muted/30 to-primary/10 relative overflow-hidden border-b-2 border-border pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                      {product.image.startsWith("http") ? (
                        <Image
                          src={
                            product.image ||
                            "https://loremflickr.com/500/500/industrial"
                          }
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-muted-foreground/30 italic font-semibold text-xs md:text-base">
                          {product.image}
                        </div>
                      )}
                    </div>

                    {product.badge && (
                      <motion.div
                        initial={{ x: -50 }}
                        animate={{ x: 0 }}
                        className={cn(
                          "absolute top-2 md:top-3 left-2 md:left-3 px-2 py-0.5 md:py-1 rounded-md text-[8px] md:text-[10px] font-bold shadow-lg uppercase tracking-wider",
                          product.badge === "Best Seller" &&
                          "bg-orange-500 text-white",
                          product.badge === "Top Rated" &&
                          "bg-yellow-500 text-black",
                          product.badge === "Trending" &&
                          "bg-pink-500 text-white",
                          product.badge === "New" && "bg-green-500 text-white",
                          product.badge === "Popular" &&
                          "bg-blue-500 text-white",
                        )}
                      >
                        {product.badge}
                      </motion.div>
                    )}

                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-primary text-primary-foreground px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-bold shadow-lg uppercase tracking-wider">
                      {product.category}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: hoveredProduct === product.id ? 1 : 0,
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 z-10 pointer-events-none"
                    >
                      <div className="pointer-events-auto flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleQuickView(product, e)}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4 text-gray-700" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className={cn(
                            "p-2 rounded-full shadow-lg transition-colors",
                            wishlist.includes(product.id)
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-white hover:bg-gray-100"
                          )}
                          title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart className={cn(
                            "w-4 h-4",
                            wishlist.includes(product.id)
                              ? "text-white fill-white"
                              : "text-gray-700"
                          )} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleAddToCart(product, e)}
                          className="p-2 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-3 md:p-5 bg-card pointer-events-none">
                    <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                      </motion.div>
                      <span className="text-[9px] md:text-[11px] font-semibold text-blue-500 uppercase tracking-wider truncate">
                        {product.seller}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs md:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.floor(product.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-4">
                      <span className="font-semibold text-foreground">
                        {product.orders.toLocaleString("en-IN")}
                      </span>{" "}
                      orders
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg md:text-2xl font-bold text-primary">
                          {product.price}
                        </span>
                        <span className="text-[8px] md:text-xs text-muted-foreground ml-1">
                          / Unit
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 bg-primary text-primary-foreground border-2 border-primary py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all pointer-events-auto relative z-10"
                    >
                      Connect Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
