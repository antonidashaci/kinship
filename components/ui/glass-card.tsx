"use client"

import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "solid" | "elevated" | "glow"
  hover?: boolean
  glowColor?: "warm" | "love" | "sage" | "sky"
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = true, glowColor, children, ...props }, ref) => {
    const variants = {
      default: "glass-panel",
      solid: "glass-panel-solid",
      elevated: "glass-panel-elevated",
      glow: "glass-panel glow-warm",
    }

    const glowColors = {
      warm: "shadow-[inset_0_0_60px_rgba(255,140,105,0.08)]",
      love: "shadow-[inset_0_0_60px_rgba(232,93,117,0.08)]",
      sage: "shadow-[inset_0_0_60px_rgba(168,197,181,0.12)]",
      sky: "shadow-[inset_0_0_60px_rgba(184,212,232,0.12)]",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-[1.5rem] p-6",
          variants[variant],
          hover && "depth-shift cursor-pointer",
          glowColor && glowColors[glowColor],
          className,
        )}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.2, 0.9, 0.3, 1],
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
