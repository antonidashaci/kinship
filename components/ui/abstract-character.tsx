"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AbstractCharacterProps {
  variant?: "blob" | "heart" | "star" | "cloud" | "wave"
  color?: "warm" | "cool" | "love" | "calm" | "mint"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  animate?: boolean
}

const colorGradients = {
  warm: ["#FFB699", "#FF8C69", "#E85D75"],
  cool: ["#B8D4E8", "#9DC4E8", "#7AAFE0"],
  love: ["#FFB3BE", "#E85D75", "#D14D65"],
  calm: ["#D4C5E8", "#B8A8D8", "#9B8CC8"],
  mint: ["#D4EBE3", "#A8C5B5", "#8BB5A5"],
}

export function AbstractCharacter({
  variant = "blob",
  color = "warm",
  size = "md",
  className,
  animate = true,
}: AbstractCharacterProps) {
  const [c1, c2, c3] = colorGradients[color]
  const sizes = {
    sm: 56,
    md: 96,
    lg: 140,
    xl: 200,
  }
  const s = sizes[size]

  // More organic, huggable SVG shapes
  const shapes: Record<string, React.ReactNode> = {
    blob: (
      <path
        d={`
          M${s * 0.5},${s * 0.08}
          C${s * 0.78},${s * 0.08} ${s * 0.92},${s * 0.28} ${s * 0.88},${s * 0.5}
          C${s * 0.84},${s * 0.72} ${s * 0.68},${s * 0.92} ${s * 0.5},${s * 0.92}
          C${s * 0.28},${s * 0.92} ${s * 0.12},${s * 0.72} ${s * 0.12},${s * 0.5}
          C${s * 0.12},${s * 0.28} ${s * 0.25},${s * 0.08} ${s * 0.5},${s * 0.08}
        `}
      />
    ),
    heart: (
      <path
        d={`
          M${s * 0.5},${s * 0.88}
          C${s * 0.5},${s * 0.88} ${s * 0.1},${s * 0.58} ${s * 0.1},${s * 0.38}
          C${s * 0.1},${s * 0.2} ${s * 0.25},${s * 0.12} ${s * 0.38},${s * 0.18}
          C${s * 0.45},${s * 0.22} ${s * 0.5},${s * 0.3} ${s * 0.5},${s * 0.3}
          C${s * 0.5},${s * 0.3} ${s * 0.55},${s * 0.22} ${s * 0.62},${s * 0.18}
          C${s * 0.75},${s * 0.12} ${s * 0.9},${s * 0.2} ${s * 0.9},${s * 0.38}
          C${s * 0.9},${s * 0.58} ${s * 0.5},${s * 0.88} ${s * 0.5},${s * 0.88}
        `}
      />
    ),
    star: (
      <path
        d={`
          M${s * 0.5},${s * 0.08}
          L${s * 0.62},${s * 0.38}
          L${s * 0.95},${s * 0.38}
          L${s * 0.68},${s * 0.58}
          L${s * 0.8},${s * 0.92}
          L${s * 0.5},${s * 0.72}
          L${s * 0.2},${s * 0.92}
          L${s * 0.32},${s * 0.58}
          L${s * 0.05},${s * 0.38}
          L${s * 0.38},${s * 0.38}
          Z
        `}
      />
    ),
    cloud: (
      <path
        d={`
          M${s * 0.2},${s * 0.65}
          C${s * 0.08},${s * 0.65} ${s * 0.08},${s * 0.45} ${s * 0.2},${s * 0.45}
          C${s * 0.2},${s * 0.28} ${s * 0.35},${s * 0.22} ${s * 0.5},${s * 0.32}
          C${s * 0.58},${s * 0.18} ${s * 0.88},${s * 0.28} ${s * 0.82},${s * 0.45}
          C${s * 0.95},${s * 0.45} ${s * 0.95},${s * 0.65} ${s * 0.8},${s * 0.65}
          Z
        `}
      />
    ),
    wave: (
      <path
        d={`
          M${s * 0.05},${s * 0.5}
          Q${s * 0.25},${s * 0.25} ${s * 0.5},${s * 0.5}
          Q${s * 0.75},${s * 0.75} ${s * 0.95},${s * 0.5}
          L${s * 0.95},${s * 0.85}
          Q${s * 0.75},${s * 0.6} ${s * 0.5},${s * 0.85}
          Q${s * 0.25},${s * 1.1} ${s * 0.05},${s * 0.85}
          Z
        `}
      />
    ),
  }

  const gradientId = `char-grad-${variant}-${color}-${size}`
  const shadowId = `char-shadow-${variant}-${color}-${size}`

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={cn("drop-shadow-xl", className)}
      initial={{ scale: 0, rotate: -15 }}
      animate={
        animate
          ? {
              scale: 1,
              rotate: 0,
              y: [0, -8, 0],
            }
          : { scale: 1, rotate: 0 }
      }
      transition={
        animate
          ? {
              scale: { type: "spring", stiffness: 300, damping: 18 },
              y: { repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" },
            }
          : { type: "spring", stiffness: 300, damping: 18 }
      }
      whileHover={{ scale: 1.08, rotate: 5 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor={c2} floodOpacity="0.35" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={c3} floodOpacity="0.2" />
        </filter>
      </defs>
      <g fill={`url(#${gradientId})`} filter={`url(#${shadowId})`}>
        {shapes[variant]}
      </g>
      {/* Inner highlight for 3D effect */}
      <ellipse
        cx={s * 0.4}
        cy={s * 0.35}
        rx={s * 0.15}
        ry={s * 0.1}
        fill="rgba(255,255,255,0.35)"
        style={{ filter: "blur(4px)" }}
      />
    </motion.svg>
  )
}
