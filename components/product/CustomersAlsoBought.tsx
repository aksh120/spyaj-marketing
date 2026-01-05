"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { supabase } from "@/lib/db";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  rating: number;
  images: { url: string; alt?: string }[];
  seller?: { slug: string };
}

interface CustomersAlsoBoughtProps {
  currentProductId: string;
  categorySlug?: string;
  limit?: number;
}

export default function CustomersAlsoBought({
  currentProductId,
  categorySlug,
  limit = 4,
}: CustomersAlsoBoughtProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let query = supabase
          .from("products")
          .select(
            `
                        id, name, slug, price, rating, images,
                        seller:sellers(slug)
                    `,
          )
          .eq("is_active", true)
          .neq("id", currentProductId)
          .limit(limit);

        const { data, error } = await query.order("rating", {
          ascending: false,
        });

        if (error) {
          console.error("Error fetching related products:", error);
        } else if (data) {
          const mapped = data.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            name: p.name as string,
            slug: p.slug as string,
            price: p.price as string,
            rating: (p.rating as number) || 0,
            images: (p.images as { url: string; alt?: string }[]) || [],
            seller:
              Array.isArray(p.seller) && p.seller.length > 0
                ? (p.seller[0] as { slug: string })
                : undefined,
          }));
          setRelatedProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, limit]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm">Customers Also Bought</h3>
        </div>
        <Link
          href="/marketplace"
          className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {relatedProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={`/product/${product.seller?.slug || "verified-seller"}/${product.slug}`}
              className="block bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
            >
              <div className="relative aspect-square bg-muted">
                {product.images &&
                product.images.length > 0 &&
                product.images[0].url.startsWith("http") ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-primary font-bold">
                    {product.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ⭐ {product.rating || 0}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
