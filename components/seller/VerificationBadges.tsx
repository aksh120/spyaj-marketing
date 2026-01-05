"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Video,
  FileCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Certificate {
  name: string;
  issuer: string;
  year: number;
}

interface VerificationBadgesProps {
  tier: "Gold" | "Silver" | "Bronze";
  factoryVerified: boolean;
  tradeAssurance: boolean;
  certificates: Certificate[];
  className?: string;
}

export function VerificationBadges({
  tier,
  factoryVerified,
  tradeAssurance,
  certificates,
  className,
}: VerificationBadgesProps) {
  const tierColors = {
    Gold: "from-yellow-400 to-yellow-600",
    Silver: "from-gray-300 to-gray-500",
    Bronze: "from-orange-400 to-orange-600",
  };

  const tierBg = {
    Gold: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    Silver:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    Bronze:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className={cn("space-y-4", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm",
          tierBg[tier],
        )}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center",
            tierColors[tier],
          )}
        >
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        {tier} Verified Supplier
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {factoryVerified && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800"
          >
            <Building2 className="w-3.5 h-3.5" />
            Factory Verified
          </motion.div>
        )}

        {tradeAssurance && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Trade Assurance
          </motion.div>
        )}
      </div>

      {certificates.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Award className="w-3 h-3" /> Certifications
          </h4>
          <div className="flex flex-wrap gap-2">
            {certificates.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-muted rounded text-xs font-medium border border-border"
              >
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {cert.name}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FactoryTourVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  className?: string;
}

export function FactoryTourVideo({
  videoUrl,
  thumbnailUrl,
  className,
}: FactoryTourVideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative rounded-xl overflow-hidden border-2 border-border",
        className,
      )}
    >
      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 text-white rounded-lg text-xs font-bold backdrop-blur-sm">
        <Video className="w-3.5 h-3.5" />
        Factory Tour
      </div>

      <div className="aspect-video bg-muted flex items-center justify-center">
        {videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? (
          <iframe
            src={videoUrl.replace("watch?v=", "embed/")}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Video Tour Available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
