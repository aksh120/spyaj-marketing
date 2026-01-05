"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Clock, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/db";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: { url: string; alt?: string }[];
  category?: { name: string; slug: string };
  seller?: { name: string; slug: string };
}

const trendingSearches = [
  "Cotton Yarn",
  "Industrial Machinery",
  "Steel Pipes",
  "Organic Chemicals",
  "LED Lights",
  "Textile Fabric",
];

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
}

export interface SearchAutocompleteRef {
  setQuery: (query: string) => void;
  triggerSearch: (query: string) => void;
}

const SearchAutocomplete = forwardRef<
  SearchAutocompleteRef,
  SearchAutocompleteProps
>(({ onSearch }, ref) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    setQuery: (newQuery: string) => {
      setQuery(newQuery);
      setIsOpen(true);
    },
    triggerSearch: (searchQuery: string) => {
      handleSearch(searchQuery);
    },
  }));

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
                            id, name, slug, price, images,
                            category:categories(name, slug),
                            seller:sellers(name, slug)
                        `,
          )
          .eq("is_active", true)
          .or(`name.ilike.%${query}%`)
          .limit(5);

        if (error) {
          console.error("Search error:", error);
        } else if (data) {
          const mapped = data.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            name: p.name as string,
            slug: p.slug as string,
            price: p.price as string,
            images: (p.images as { url: string; alt?: string }[]) || [],
            category:
              Array.isArray(p.category) && p.category.length > 0
                ? (p.category[0] as { name: string; slug: string })
                : undefined,
            seller:
              Array.isArray(p.seller) && p.seller.length > 0
                ? (p.seller[0] as { name: string; slug: string })
                : undefined,
          }));
          setSearchResults(mapped);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const filteredProducts = searchResults;

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [
      searchTerm,
      ...recentSearches.filter((s) => s !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setQuery(searchTerm);
    setIsOpen(false);
    onSearch?.(searchTerm);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, categories..."
          className="w-full bg-background border-2 border-border rounded-full py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden z-[60]"
          >
            {query.length > 1 ? (
              <div className="p-2 text-gray-900 dark:text-gray-100">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-semibold uppercase tracking-wider">
                      Products
                    </p>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.seller?.slug || "verified-seller"}/${product.slug}`}
                        onClick={() => {
                          handleSearch(product.name);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                          {product.images &&
                          product.images.length > 0 &&
                          product.images[0].url.startsWith("http") ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category?.name || "Product"}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {product.price}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No products found for "{query}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 space-y-4 text-gray-900 dark:text-gray-100">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Recent
                      </p>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term);
                            handleSearch(term);
                          }}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 px-2 mb-2">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          handleSearch(term);
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SearchAutocomplete.displayName = "SearchAutocomplete";

export default SearchAutocomplete;
