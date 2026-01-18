"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface BentoGridProps {
  className?: string
  children: ReactNode
}

interface BentoItemProps {
  className?: string
  children: ReactNode
  span?: "1" | "2" | "row"
  delay?: number
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
        "auto-rows-[minmax(180px,auto)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BentoItem({ className, children, span = "1", delay = 0 }: BentoItemProps) {
  const spanClasses = {
    "1": "",
    "2": "md:col-span-2",
    row: "md:col-span-2 lg:col-span-3",
  }

  return (
    <motion.div
      className={cn(
        "glass-panel-solid rounded-3xl p-6",
        "hover:shadow-xl transition-shadow duration-300",
        spanClasses[span],
        className,
      )}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  )
}
