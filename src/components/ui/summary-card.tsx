import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  delay?: number;
}

const variantStyles = {
  default: "bg-white border border-gray-200 hover:shadow-lg transition-all duration-300",
  primary: "bg-teal-600 text-white hover:bg-teal-700",
  success: "bg-green-600 text-white hover:bg-green-700",
  warning: "bg-amber-500 text-white hover:bg-amber-600",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const iconVariantStyles = {
  default: "bg-teal-100 text-teal-600",
  primary: "bg-white/20 text-white",
  success: "bg-white/20 text-white",
  warning: "bg-white/20 text-white",
  destructive: "bg-white/20 text-white",
};

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm transition-shadow hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2 min-w-0">
          <p
            className={cn(
              "text-xs sm:text-sm font-medium truncate",
              variant === "default" ? "text-muted-foreground" : "opacity-80"
            )}
          >
            {title}
          </p>
          <p className={cn(
            "text-2xl md:text-3xl font-bold tracking-tight",
            variant === "default" ? "text-gray-900" : "text-white"
          )}>
            {value}
          </p>
          {trend && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend.isPositive
                  ? variant === "default" 
                    ? "text-green-600" 
                    : "text-white/90"
                  : variant === "default"
                  ? "text-red-600"
                  : "text-white/90"
              )}
            >
              <span className={cn(
                "text-sm",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? "↗" : "↘"}
              </span>
              {Math.abs(trend.value)}% from last month
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring", stiffness: 200 }}
          className={cn(
            "rounded-lg p-2 md:p-3 transition-colors duration-200",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
