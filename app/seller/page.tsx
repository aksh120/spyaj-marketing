"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin, Star, ArrowRight } from "lucide-react";
import { sellers } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function SellersDirectory() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller, index) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
          >
            <div className="h-32 bg-gray-100 relative">
              <Image
                src={seller.banner}
                alt={seller.name}
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-lg">
                  <Image
                    src={seller.logo}
                    alt={seller.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="text-white">
                  <h3 className="font-bold text-lg leading-tight">
                    {seller.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-200">
                    <MapPin className="w-3 h-3" /> {seller.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider border",
                    seller.tier === "Gold"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : seller.tier === "Silver"
                        ? "bg-gray-100 text-gray-600 border-gray-200"
                        : "bg-orange-100 text-orange-700 border-orange-200",
                  )}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {seller.tier} Verified
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
                  {seller.rating}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-muted/50 p-2 rounded text-center">
                  <div className="text-muted-foreground mb-0.5">Response</div>
                  <div className="font-bold">{seller.responseTime}</div>
                </div>
                <div className="bg-muted/50 p-2 rounded text-center">
                  <div className="text-muted-foreground mb-0.5">Delivery</div>
                  <div className="font-bold">{seller.deliverySuccess}</div>
                </div>
              </div>

              <Link
                href={`/seller/${seller.id}`}
                className="block w-full bg-primary text-primary-foreground text-center py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Visit Store <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
