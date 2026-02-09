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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -4,
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
        variantStyles[variant]
      )}
    >
      {/* Background gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      
      {/* Animated border */}
      <motion.div 
        className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-white/20"
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.1 }}
            className={cn(
              "text-xs sm:text-sm font-semibold tracking-wide uppercase truncate",
              variant === "default" ? "text-muted-foreground" : "text-white/80"
            )}
          >
            {title}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: delay + 0.2,
              type: "spring",
              stiffness: 200
            }}
            className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight",
              variant === "default" ? "text-gray-900" : "text-white"
            )}
            whileHover={{ scale: 1.05 }}
          >
            {value}
          </motion.p>
          
          {trend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ 
                  rotate: trend.isPositive ? [0, 5, 0] : [0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                  trend.isPositive 
                    ? "bg-green-500/20 text-green-600" 
                    : "bg-red-500/20 text-red-600"
                )}
              >
                {trend.isPositive ? "↗" : "↘"}
              </motion.div>
              <p className={cn(
                "text-xs font-medium",
                trend.isPositive
                  ? variant === "default" 
                    ? "text-green-600" 
                    : "text-green-200"
                  : variant === "default"
                  ? "text-red-600"
                  : "text-red-200"
              )}>
                {Math.abs(trend.value)}% from last month
              </p>
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: delay + 0.15, 
            type: "spring", 
            stiffness: 200,
            damping: 10
          }}
          whileHover={{ 
            rotate: [0, -5, 5, 0],
            scale: 1.1,
            transition: { duration: 0.3 }
          }}
          className={cn(
            "relative rounded-xl p-3 md:p-4 transition-all duration-300 shadow-lg",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6 relative z-10" />
          
          {/* Icon background glow */}
          <motion.div 
            className="absolute inset-0 rounded-xl bg-current opacity-20 group-hover:opacity-30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
