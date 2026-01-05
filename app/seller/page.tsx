"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  MapPin,
  Star,
  ArrowRight,
  Loader2,
  Users,
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
  response_time: string | null;
  delivery_success: string | null;
  location: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

export default function SellersDirectory() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data, error } = await supabase
          .from("sellers")
          .select("*")
          .eq("is_active", true)
          .order("rating", { ascending: false });

        if (error) {
          console.error("Error fetching sellers:", error);
        } else if (data) {
          setSellers(data);
        }
      } catch (err) {
        console.error("Failed to fetch sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Silver":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "Platinum":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-[80px] md:pt-[100px]">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black mb-4"
        >
          Verified Suppliers
        </motion.h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect with top-rated manufacturers and distributors verified for
          quality and reliability.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : sellers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Sellers Yet</h3>
          <p className="text-muted-foreground">
            Verified suppliers will appear here once added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {seller.banner_url && (
                  <Image
                    src={seller.banner_url}
                    alt={seller.name}
                    fill
                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-lg flex items-center justify-center">
                    {seller.logo_url ? (
                      <Image
                        src={seller.logo_url}
                        alt={seller.name}
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {seller.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold text-lg leading-tight">
                      {seller.name}
                    </h3>
                    {seller.location && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-200">
                        <MapPin className="w-3 h-3" /> {seller.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider border",
                      getTierStyles(seller.tier),
                    )}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {seller.tier} Verified
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                    {seller.rating || 0}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-muted/50 p-2 rounded text-center">
                    <div className="text-muted-foreground mb-0.5">Response</div>
                    <div className="font-bold">
                      {seller.response_time || "N/A"}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded text-center">
                    <div className="text-muted-foreground mb-0.5">Delivery</div>
                    <div className="font-bold">
                      {seller.delivery_success || "N/A"}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/seller/${seller.slug}`}
                  className="block w-full bg-primary text-primary-foreground text-center py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Visit Store <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
