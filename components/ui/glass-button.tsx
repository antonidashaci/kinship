"use client"

import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "love" | "soft"
  size?: "sm" | "md" | "lg" | "icon"
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: `
        bg-gradient-to-b from-[#ff9a7b] to-[#ff8c69] 
        text-white font-semibold
        shadow-[0_2px_8px_rgba(255,140,105,0.35),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.25)]
        hover:shadow-[0_4px_16px_rgba(255,140,105,0.4),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]
        active:shadow-[0_1px_4px_rgba(255,140,105,0.3),inset_0_1px_2px_rgba(0,0,0,0.1)]
      `,
      secondary: `
        glass-panel 
        text-foreground font-medium
        hover:bg-white/90
      `,
      ghost: `
        bg-transparent 
        text-foreground/80 font-medium
        hover:bg-white/50
      `,
      love: `
        bg-gradient-to-b from-[#f06b85] to-[#e85d75]
        text-white font-semibold
        shadow-[0_2px_8px_rgba(232,93,117,0.35),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.25)]
        hover:shadow-[0_4px_16px_rgba(232,93,117,0.4),0_2px_4px_rgba(0,0,0,0.1)]
        glow-love
      `,
      soft: `
        bg-gradient-to-b from-white/90 to-white/70
        text-foreground font-medium
        shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
        hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)]
        border border-white/60
      `,
    }

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl gap-1.5",
      md: "px-6 py-3 text-[15px] rounded-2xl gap-2",
      lg: "px-8 py-4 text-base rounded-[1.25rem] gap-2.5",
      icon: "p-3 rounded-2xl",
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          "transition-all duration-200 squishy refraction",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8c69]/50 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
GlassButton.displayName = "GlassButton"

export { GlassButton }
