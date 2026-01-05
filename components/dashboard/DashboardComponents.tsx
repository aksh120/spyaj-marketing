"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  className,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card border-2 border-border rounded-xl p-4 hover:border-primary/30 transition-all",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              isPositive &&
                "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              isNegative &&
                "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
              !isPositive &&
                !isNegative &&
                "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
            )}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-black">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
}

interface SimpleChartProps {
  data: number[];
  height?: number;
  color?: string;
  className?: string;
}

export function SimpleBarChart({
  data,
  height = 100,
  color = "primary",
  className,
}: SimpleChartProps) {
  const max = Math.max(...data);

  return (
    <div className={cn("flex items-end gap-1", className)} style={{ height }}>
      {data.map((value, idx) => (
        <motion.div
          key={idx}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          className={cn(
            "flex-1 rounded-t-sm transition-all hover:opacity-80",
            color === "primary" && "bg-primary",
            color === "green" && "bg-green-500",
            color === "blue" && "bg-blue-500",
            color === "orange" && "bg-orange-500",
          )}
          title={value.toString()}
        />
      ))}
    </div>
  );
}

export function SimpleLineChart({
  data,
  height = 100,
  color = "primary",
  className,
}: SimpleChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        className={cn(
          color === "primary" && "text-primary",
          color === "green" && "text-green-500",
          color === "blue" && "text-blue-500",
          color === "orange" && "text-orange-500",
        )}
      />
    </svg>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  color = "primary",
  showValue = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-bold">{value.toLocaleString()}</span>
          )}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={cn(
            "h-full rounded-full",
            color === "primary" && "bg-primary",
            color === "green" && "bg-green-500",
            color === "blue" && "bg-blue-500",
            color === "orange" && "bg-orange-500",
          )}
        />
      </div>
    </div>
  );
}
