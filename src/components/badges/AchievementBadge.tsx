"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}

export function AchievementBadge({
  achievement,
  size = "md",
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "h-16 w-16 text-xl",
    md: "h-20 w-20 text-2xl",
    lg: "h-24 w-24 text-3xl",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "flex flex-col items-center gap-2 text-center",
        !achievement.earned && "opacity-40 grayscale"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-md",
          sizeClasses[size],
          achievement.color
        )}
      >
        <span>{achievement.icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold leading-tight">{achievement.title}</p>
        {achievement.earned && achievement.earnedAt && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {new Date(achievement.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}
