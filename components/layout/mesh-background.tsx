"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { AmbientDecorations } from "./ambient-decorations"

interface MeshBackgroundProps {
  variant?: "default" | "calm" | "love" | "minimal"
  decorations?: "home" | "welcome" | "auth" | "minimal"
  className?: string
  children: React.ReactNode
}

export function MeshBackground({ variant = "default", decorations = "home", className, children }: MeshBackgroundProps) {
  const gradients = {
    default: "mesh-gradient",
    calm: "mesh-gradient-calm",
    love: "bg-gradient-to-br from-[#fff5f7] via-[#ffecf0] to-[#ffe4e9]",
    minimal: "bg-[#faf8f6]",
  }

  return (
    <div className={cn("min-h-screen relative overflow-hidden", gradients[variant], className)}>
      {/* Ambient cozy decorations */}
      <AmbientDecorations variant={decorations} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
        {/* Large warm orb - top left */}
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,182,153,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "easeInOut",
          }}
        />

        {/* Cool orb - bottom right */}
        <motion.div
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(184,212,232,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 25,
            ease: "easeInOut",
          }}
        />

        {/* Accent orb - center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(232,93,117,0.08) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 15,
            ease: "easeInOut",
          }}
        />

        {/* Mint accent - bottom left */}
        <motion.div
          className="absolute bottom-20 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,235,227,0.35) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 18,
            ease: "easeInOut",
          }}
        />

        {/* Lavender accent - top right */}
        <motion.div
          className="absolute top-40 right-1/4 w-[250px] h-[250px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,197,232,0.25) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 22,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
