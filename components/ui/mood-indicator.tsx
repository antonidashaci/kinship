"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { MoodType } from "@/lib/types"

interface MoodIndicatorProps {
  mood: MoodType | null
  size?: "sm" | "md" | "lg" | "xl"
  showLabel?: boolean
  interactive?: boolean
  className?: string
  onClick?: () => void
}

const moodConfig: Record<MoodType, { icon: string; colors: [string, string]; label: string; glow: string }> = {
  happy: {
    icon: "sun",
    colors: ["#FFD666", "#FFBE33"],
    label: "Happy",
    glow: "rgba(255,214,102,0.4)",
  },
  calm: {
    icon: "leaf",
    colors: ["#7DD3A8", "#5BB98B"],
    label: "Calm",
    glow: "rgba(125,211,168,0.4)",
  },
  tired: {
    icon: "moon",
    colors: ["#B4B4D0", "#9090B8"],
    label: "Tired",
    glow: "rgba(180,180,208,0.4)",
  },
  stressed: {
    icon: "zap",
    colors: ["#FFB3BE", "#FF8A99"],
    label: "Stressed",
    glow: "rgba(255,179,190,0.4)",
  },
  excited: {
    icon: "sparkles",
    colors: ["#FFB870", "#FF9F47"],
    label: "Excited",
    glow: "rgba(255,184,112,0.4)",
  },
  sad: {
    icon: "cloud-rain",
    colors: ["#9DC4E8", "#7AAFE0"],
    label: "Sad",
    glow: "rgba(157,196,232,0.4)",
  },
  loved: {
    icon: "heart",
    colors: ["#FF8A99", "#E85D75"],
    label: "Loved",
    glow: "rgba(255,138,153,0.4)",
  },
  neutral: {
    icon: "cloud",
    colors: ["#E0E0E0", "#C8C8C8"],
    label: "Neutral",
    glow: "rgba(224,224,224,0.4)",
  },
}

// Simple SVG icons for moods
const MoodIcon = ({ type, size }: { type: string; size: number }) => {
  const iconSize = size * 0.5

  const icons: Record<string, React.ReactNode> = {
    sun: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
    leaf: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
    moon: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    zap: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    sparkles: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
      </svg>
    ),
    "cloud-rain": (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M16 14v6M8 14v6M12 16v6" />
      </svg>
    ),
    heart: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    cloud: (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  }

  return <span className="text-white drop-shadow-sm">{icons[type]}</span>
}

export function MoodIndicator({
  mood,
  size = "md",
  showLabel = false,
  interactive = false,
  className,
  onClick,
}: MoodIndicatorProps) {
  const config = mood ? moodConfig[mood] : moodConfig.neutral
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  }
  const s = sizes[size]

  const MotionComponent = interactive ? motion.button : motion.div

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <MotionComponent
        className={cn("rounded-full flex items-center justify-center relative", interactive && "cursor-pointer")}
        style={{
          width: s,
          height: s,
          background: `linear-gradient(145deg, ${config.colors[0]}, ${config.colors[1]})`,
          boxShadow: `0 4px 20px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
        }}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={onClick}
        {...(interactive ? { disabled: false } : {})}
        aria-label={config.label}
      >
        <MoodIcon type={config.icon} size={s} />
      </MotionComponent>
      {showLabel && <span className="text-sm font-medium text-foreground/70">{config.label}</span>}
    </div>
  )
}
