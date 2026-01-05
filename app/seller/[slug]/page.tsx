"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Star,
  PlayCircle,
  Clock,
  Truck,
  Loader2,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/db";
import { cn } from "@/lib/utils";

interface Seller {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  is_verified: boolean;
  rating: number;
  response_rate: string | null;
  response_time: string | null;
  delivery_success: string | null;
  location: string | null;
  joined_year: number | null;
  logo_url: string | null;
  banner_url: string | null;
  certifications: string[];
  contact_email: string | null;
  contact_phone: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  rating: number;
  images: { url: string; alt?: string }[];
}

export default function SellerMicrosite() {
  const params = useParams();
  const slug = params.slug as string;
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "about">("products");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from("sellers")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (sellerError || !sellerData) {
          console.error("Error fetching seller:", sellerError);
          setLoading(false);
          return;
        }

        setSeller(sellerData);

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id, name, slug, price, rating, images")
          .eq("seller_id", sellerData.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (productsError) {
          console.error("Error fetching products:", productsError);
        } else if (productsData) {
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Seller Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The seller profile you are looking for does not exist.
          </p>
          <Link href="/marketplace" className="text-primary hover:underline">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500";
      case "Silver":
        return "bg-gray-400/20 text-gray-300 border-gray-400";
      case "Platinum":
        return "bg-purple-400/20 text-purple-400 border-purple-400";
      default:
        return "bg-orange-700/20 text-orange-400 border-orange-700";
    }
  };

  return (
    <div className="min-h-screen pt-[80px]">
      <div className="relative h-[200px] md:h-[300px] bg-gradient-to-r from-blue-600 to-purple-600">
        {seller.banner_url && (
          <Image
            src={seller.banner_url}
            alt="Store Banner"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-xl overflow-hidden border-4 border-white flex-shrink-0 -mb-12 md:-mb-16 flex items-center justify-center">
              {seller.logo_url ? (
                <Image
                  src={seller.logo_url}
                  alt={seller.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {seller.name[0]}
                </span>
              )}
            </div>
            <div className="text-white flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-4xl font-black">
                  {seller.name}
                </h1>
                {seller.is_verified && (
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 uppercase tracking-wider border",
                      getTierStyle(seller.tier),
                    )}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {seller.tier} Verified
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs md:text-sm text-gray-300">
                {seller.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {seller.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{" "}
                  {seller.rating || 0} Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-card border-2 border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Seller Trust
              Profile
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Response Time
                </div>
                <div className="font-bold text-green-600 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> {seller.response_time || "N/A"}
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Delivery Success
                </div>
                <div className="font-bold text-primary flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3" />{" "}
                  {seller.delivery_success || "N/A"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-bold">
                  {seller.response_rate || "N/A"}
                </span>
              </div>
              {seller.response_rate && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: seller.response_rate }}
                  ></div>
                </div>
              )}

              {seller.certifications && seller.certifications.length > 0 && (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="text-xs font-bold uppercase text-muted-foreground mb-2">
                    Verified Certifications
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seller.certifications.map((cert: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-primary/5 text-primary px-2 py-1 rounded text-[10px] font-bold border border-primary/10"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg text-center">
            <h3 className="font-bold text-lg mb-2">Ready to Trade?</h3>
            <p className="text-sm opacity-90 mb-4">
              Contact {seller.name} for quotes and inquiries.
            </p>
            <button className="w-full bg-white text-primary font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              Contact Supplier
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-border mb-6">
            <button
              onClick={() => setActiveTab("products")}
              className={cn(
                "pb-3 text-sm font-bold border-b-2 transition-all",
                activeTab === "products"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={cn(
                "pb-3 text-sm font-bold border-b-2 transition-all",
                activeTab === "about"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              About Company
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "products" ? (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
                    <p className="text-muted-foreground">
                      This seller hasn&apos;t added any products yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${seller.slug}/${product.slug}`}
                        className="block"
                      >
                        <div className="bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-all group cursor-pointer h-full">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                📦
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-sm mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="flex justify-between items-center">
                            <span className="text-primary font-bold">
                              {product.price}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                              {product.rating || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card border border-border rounded-xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold mb-4">About {seller.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {seller.description || "No description available."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-border">
                  <div>
                    <div className="text-2xl font-black text-primary">
                      {seller.joined_year
                        ? new Date().getFullYear() - seller.joined_year
                        : "N/A"}
                      +
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Years Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">
                      {products.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Products Listed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">
                      {seller.rating || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Support</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
