"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, MapPin, Navigation, Filter, Star, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const suppliers = [
  {
    id: 1,
    name: "Gujarat Textiles",
    category: "Textiles",
    location: "Ahmedabad, India",
    rating: 4.8,
    top: "45%",
    left: "68%",
    verified: true,
  },
  {
    id: 2,
    name: "Machinery World",
    category: "Machinery",
    location: "Ludhiana, India",
    rating: 4.6,
    top: "38%",
    left: "67%",
    verified: true,
  },
  {
    id: 3,
    name: "EcoEnergy Systems",
    category: "Electronics",
    location: "Bangalore, India",
    rating: 4.9,
    top: "55%",
    left: "68%",
    verified: true,
  },
  {
    id: 4,
    name: "Metro Steel Works",
    category: "Industrial",
    location: "Mumbai, India",
    rating: 4.7,
    top: "52%",
    left: "66%",
    verified: true,
  },
  {
    id: 5,
    name: "Global Tech",
    category: "Electronics",
    location: "Shenzhen, China",
    rating: 4.5,
    top: "42%",
    left: "75%",
    verified: false,
  },
  {
    id: 6,
    name: "Euro Machines",
    category: "Machinery",
    location: "Berlin, Germany",
    rating: 4.8,
    top: "35%",
    left: "50%",
    verified: true,
  },
  {
    id: 7,
    name: "US Agrotech",
    category: "Agriculture",
    location: "Chicago, USA",
    rating: 4.7,
    top: "38%",
    left: "25%",
    verified: true,
  },
];

export default function SourcingMapPage() {
  const [activeSupplier, setActiveSupplier] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSuppliers = suppliers.filter(
    (s) =>
      (selectedCategory === "All" || s.category === selectedCategory) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="h-screen pt-[80px] flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-[350px] bg-card border-r border-border flex flex-col shadow-xl z-20">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-black mb-1">Sourcing Map</h1>
          <p className="text-xs text-muted-foreground">
            Find verified suppliers near you
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search suppliers or location..."
              className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "All",
              "Textiles",
              "Machinery",
              "Electronics",
              "Industrial",
              "Agriculture",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => setActiveSupplier(supplier.id)}
              className={cn(
                "p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
                activeSupplier === supplier.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30",
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm">{supplier.name}</h3>
                {supplier.verified && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {supplier.location}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{supplier.rating}</span>
                </div>
                <button className="text-xs font-bold text-primary border border-primary px-2 py-1 rounded hover:bg-primary/5 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-blue-50/50 dark:bg-slate-900 relative overflow-hidden group">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20 pointer-events-none">
          <svg viewBox="0 0 1000 500" className="w-full h-full fill-current">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              fontSize="50"
              fontWeight="bold"
            >
              Interactive World Map
            </text>
          </svg>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-gray-50 border border-border">
            <Navigation className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-gray-50 border border-border">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500"
            style={{ top: supplier.top, left: supplier.left }}
            onClick={() => setActiveSupplier(supplier.id)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: activeSupplier === supplier.id ? 1.2 : 1 }}
              whileHover={{ scale: 1.2 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-800 relative z-10",
                activeSupplier === supplier.id
                  ? "bg-primary text-primary-foreground scale-110 z-20"
                  : "bg-card text-foreground",
              )}
            >
              <MapPin className="w-4 h-4" />
              {activeSupplier === supplier.id && (
                <motion.div
                  layoutId="pulse"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>

            <AnimatePresence>
              {activeSupplier === supplier.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-card border border-border p-3 rounded-xl shadow-xl w-48 z-30"
                >
                  <h4 className="font-bold text-sm mb-1">{supplier.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {supplier.category} • {supplier.location}
                  </p>
                  <button className="w-full bg-primary text-primary-foreground text-xs py-1.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5">
                    <Phone className="w-3 h-3" /> Contact
                  </button>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
