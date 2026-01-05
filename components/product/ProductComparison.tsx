"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, Plus, Check, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn, slugify } from "@/lib/utils";

interface CompareProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  seller: string;
  category: string;
  rating: number;
  moq?: number;
}

export function useProductComparison() {
  const [compareList, setCompareList] = useState<CompareProduct[]>([]);

  const addToCompare = (product: CompareProduct) => {
    if (compareList.length >= 4) return false;
    if (compareList.find((p) => p.id === product.id)) return false;
    setCompareList([...compareList, product]);
    return true;
  };

  const removeFromCompare = (productId: number) => {
    setCompareList(compareList.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: number) => {
    return compareList.some((p) => p.id === productId);
  };

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };
}

interface CompareButtonProps {
  product: CompareProduct;
  isInCompare: boolean;
  onAdd: () => void;
  onRemove: () => void;
  className?: string;
}

export function CompareButton({
  product,
  isInCompare,
  onAdd,
  onRemove,
  className,
}: CompareButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isInCompare ? onRemove() : onAdd();
      }}
      className={cn(
        "p-2 rounded-full transition-all",
        isInCompare
          ? "bg-primary text-primary-foreground"
          : "bg-white/80 dark:bg-black/50 text-gray-700 dark:text-white hover:bg-primary/20",
        className,
      )}
      title={isInCompare ? "Remove from compare" : "Add to compare"}
    >
      <Scale className="w-4 h-4" />
    </motion.button>
  );
}

interface CompareBarProps {
  compareList: CompareProduct[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function CompareBar({
  compareList,
  onRemove,
  onClear,
}: CompareBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t-2 border-gray-200 dark:border-zinc-700 shadow-2xl z-40 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">
              Compare ({compareList.length}/4)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border"
              >
                {product.image.startsWith("http") ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">
                    📦
                  </div>
                )}
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={compareList.length < 2}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Now
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <CompareModal
            products={compareList}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CompareModal({
  products,
  onClose,
}: {
  products: CompareProduct[];
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl max-h-[85vh] bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Product Comparison
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-sm font-bold text-muted-foreground w-32">
                  Feature
                </th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 text-center">
                    <Link
                      href={`/product/${slugify(product.seller)}/${slugify(product.name)}`}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <div className="relative w-20 h-20 mx-auto rounded-lg overflow-hidden bg-muted mb-2">
                        {product.image.startsWith("http") ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-sm truncate max-w-[150px] mx-auto">
                        {product.name}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 text-sm font-medium text-muted-foreground">
                  Price
                </td>
                {products.map((product) => (
                  <td
                    key={product.id}
                    className="p-4 text-center font-bold text-primary"
                  >
                    {product.price}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-sm font-medium text-muted-foreground">
                  Category
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center text-sm">
                    {product.category}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-sm font-medium text-muted-foreground">
                  Rating
                </td>
                {products.map((product) => (
                  <td
                    key={product.id}
                    className="p-4 text-center text-sm font-bold"
                  >
                    ⭐ {product.rating}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-sm font-medium text-muted-foreground">
                  Seller
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center text-sm">
                    {product.seller}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 text-sm font-medium text-muted-foreground">
                  MOQ
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center text-sm">
                    {product.moq || 100} units
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
