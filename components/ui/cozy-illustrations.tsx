"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CozyIllustrationProps {
  className?: string
  size?: number
}

// Adorable sleeping cat
export function SleepingCat({ className, size = 60 }: CozyIllustrationProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={cn("drop-shadow-lg", className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <defs>
        <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD4A8" />
          <stop offset="100%" stopColor="#FFB67A" />
        </linearGradient>
      </defs>
      {/* Body */}
      <motion.ellipse
        cx="30"
        cy="38"
        rx="20"
        ry="14"
        fill="url(#catGrad)"
        animate={{ scaleY: [1, 1.03, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Head */}
      <circle cx="18" cy="32" r="12" fill="url(#catGrad)" />
      {/* Ears */}
      <path d="M10 24 L8 16 L16 22 Z" fill="#FFB67A" />
      <path d="M22 22 L28 16 L26 24 Z" fill="#FFB67A" />
      <path d="M11 23 L10 18 L15 22 Z" fill="#FFCBA4" />
      <path d="M23 21 L26 18 L25 23 Z" fill="#FFCBA4" />
      {/* Closed eyes - happy lines */}
      <motion.path
        d="M13 32 Q15 30 17 32"
        stroke="#8B6914"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        animate={{ scaleY: [1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.path
        d="M19 31 Q21 29 23 31"
        stroke="#8B6914"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        animate={{ scaleY: [1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Nose */}
      <ellipse cx="18" cy="35" rx="2" ry="1.5" fill="#FF9B7A" />
      {/* Blush */}
      <circle cx="11" cy="34" r="3" fill="#FFCFCF" opacity="0.6" />
      <circle cx="25" cy="33" r="3" fill="#FFCFCF" opacity="0.6" />
      {/* Tail */}
      <motion.path
        d="M48 38 Q55 30 50 42"
        stroke="url(#catGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M48 38 Q55 30 50 42", "M48 38 Q58 35 52 45", "M48 38 Q55 30 50 42"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Zzz */}
      <motion.text
        x="32"
        y="22"
        fontSize="8"
        fill="#A78BFA"
        fontWeight="bold"
        animate={{ opacity: [0.4, 1, 0.4], y: [22, 18, 22] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        z
      </motion.text>
      <motion.text
        x="38"
        y="16"
        fontSize="10"
        fill="#A78BFA"
        fontWeight="bold"
        animate={{ opacity: [0.3, 0.8, 0.3], y: [16, 12, 16] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
      >
        z
      </motion.text>
    </motion.svg>
  )
}

// Cute bunny
export function CuteBunny({ className, size = 50 }: CozyIllustrationProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={cn("drop-shadow-lg", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
    >
      <defs>
        <linearGradient id="bunnyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF5F5" />
          <stop offset="100%" stopColor="#FFE4E6" />
        </linearGradient>
      </defs>
      {/* Body */}
      <ellipse cx="25" cy="38" rx="12" ry="10" fill="url(#bunnyGrad)" />
      {/* Head */}
      <circle cx="25" cy="24" r="11" fill="url(#bunnyGrad)" />
      {/* Ears */}
      <motion.ellipse
        cx="18"
        cy="8"
        rx="4"
        ry="10"
        fill="url(#bunnyGrad)"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "18px 18px" }}
      />
      <ellipse cx="18" cy="8" rx="2" ry="6" fill="#FFCDD2" />
      <motion.ellipse
        cx="32"
        cy="8"
        rx="4"
        ry="10"
        fill="url(#bunnyGrad)"
        animate={{ rotate: [3, -3, 3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: "32px 18px" }}
      />
      <ellipse cx="32" cy="8" rx="2" ry="6" fill="#FFCDD2" />
      {/* Eyes */}
      <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
        <circle cx="21" cy="23" r="2.5" fill="#3D2914" />
        <circle cx="29" cy="23" r="2.5" fill="#3D2914" />
        <circle cx="22" cy="22" r="1" fill="white" />
        <circle cx="30" cy="22" r="1" fill="white" />
      </motion.g>
      {/* Nose */}
      <ellipse cx="25" cy="27" rx="2" ry="1.5" fill="#FFB4B4" />
      {/* Mouth */}
      <path d="M23 29 Q25 31 27 29" stroke="#3D2914" strokeWidth="1" fill="none" />
      {/* Cheeks */}
      <circle cx="17" cy="26" r="2.5" fill="#FFD4D4" opacity="0.7" />
      <circle cx="33" cy="26" r="2.5" fill="#FFD4D4" opacity="0.7" />
      {/* Paws */}
      <ellipse cx="20" cy="46" rx="4" ry="3" fill="#FFF5F5" />
      <ellipse cx="30" cy="46" rx="4" ry="3" fill="#FFF5F5" />
    </motion.svg>
  )
}

// Steaming coffee mug
export function CoffeeMug({ className, size = 45 }: CozyIllustrationProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      className={cn("drop-shadow-lg", className)}
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
    >
      <defs>
        <linearGradient id="mugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D5C4" />
          <stop offset="100%" stopColor="#D4C4B0" />
        </linearGradient>
        <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#5D4E37" />
        </linearGradient>
      </defs>
      {/* Mug body */}
      <path
        d="M8 18 L8 36 Q8 40 12 40 L26 40 Q30 40 30 36 L30 18 Z"
        fill="url(#mugGrad)"
        stroke="#C4B5A4"
        strokeWidth="1"
      />
      {/* Coffee */}
      <ellipse cx="19" cy="20" rx="10" ry="3" fill="url(#coffeeGrad)" />
      {/* Handle */}
      <path d="M30 22 Q38 22 38 28 Q38 34 30 34" stroke="#D4C4B0" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Heart on mug */}
      <path d="M19 28 Q16 25 19 22 Q22 25 19 28" fill="#E85D75" />
      {/* Steam */}
      <motion.path
        d="M14 14 Q12 10 14 6"
        stroke="#D4C4B0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M19 12 Q17 8 19 4"
        stroke="#D4C4B0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.4, 0.9, 0.4], y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
      />
      <motion.path
        d="M24 14 Q22 10 24 6"
        stroke="#D4C4B0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
      />
    </motion.svg>
  )
}

// Beautiful flower
export function CozyFlower({ className, size = 40, color = "pink" }: CozyIllustrationProps & { color?: "pink" | "yellow" | "purple" }) {
  const colors = {
    pink: { petal: "#FFB4C2", center: "#FFD93D" },
    yellow: { petal: "#FFE566", center: "#FF9F43" },
    purple: { petal: "#D4A5FF", center: "#FFD93D" },
  }
  const { petal, center } = colors[color]

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("drop-shadow-md", className)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.g
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 20px" }}
      >
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.ellipse
            key={angle}
            cx="20"
            cy="10"
            rx="6"
            ry="9"
            fill={petal}
            transform={`rotate(${angle} 20 20)`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
        {/* Center */}
        <circle cx="20" cy="20" r="6" fill={center} />
        {/* Center details */}
        <circle cx="18" cy="18" r="1" fill="#FFB347" />
        <circle cx="22" cy="19" r="1" fill="#FFB347" />
        <circle cx="20" cy="22" r="1" fill="#FFB347" />
      </motion.g>
    </motion.svg>
  )
}

// Floating heart
export function FloatingHeart({ className, size = 24, delay = 0 }: CozyIllustrationProps & { delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("drop-shadow-sm", className)}
      initial={{ opacity: 0, scale: 0, y: 10 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.8],
        y: [10, 0, -10, -20],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#FF6B9D"
      />
    </motion.svg>
  )
}

// Little bird
export function LittleBird({ className, size = 35 }: CozyIllustrationProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      className={cn("drop-shadow-md", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <defs>
        <linearGradient id="birdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* Body */}
      <motion.ellipse
        cx="18"
        cy="20"
        rx="10"
        ry="8"
        fill="url(#birdGrad)"
        animate={{ scaleX: [1, 1.02, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Head */}
      <circle cx="24" cy="14" r="7" fill="url(#birdGrad)" />
      {/* Wing */}
      <motion.ellipse
        cx="14"
        cy="18"
        rx="6"
        ry="4"
        fill="#0EA5E9"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ transformOrigin: "18px 18px" }}
      />
      {/* Eye */}
      <circle cx="26" cy="13" r="2" fill="#1E293B" />
      <circle cx="27" cy="12" r="0.8" fill="white" />
      {/* Beak */}
      <path d="M30 15 L34 14 L30 17 Z" fill="#FBBF24" />
      {/* Tail */}
      <motion.path
        d="M8 20 L4 16 L4 24 Z"
        fill="#0EA5E9"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: "8px 20px" }}
      />
      {/* Cheek */}
      <circle cx="22" cy="16" r="2" fill="#FFD4D4" opacity="0.6" />
    </motion.svg>
  )
}

// Sparkle star
export function SparkleStars({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          <path
            d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
            fill="#FFD93D"
          />
        </motion.svg>
      ))}
    </div>
  )
}

// Cute leaf
export function FallingLeaf({ className, size = 20, delay = 0 }: CozyIllustrationProps & { delay?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={cn("drop-shadow-sm", className)}
      initial={{ opacity: 0, y: -20, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [-20, 0, 20, 40],
        rotate: [0, 45, -30, 60],
        x: [0, 10, -5, 15],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <path
        d="M10 2 Q15 5 15 10 Q15 15 10 18 Q5 15 5 10 Q5 5 10 2 Z"
        fill="#86EFAC"
      />
      <path
        d="M10 4 L10 16"
        stroke="#22C55E"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M10 8 L7 6"
        stroke="#22C55E"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M10 12 L13 10"
        stroke="#22C55E"
        strokeWidth="0.8"
        fill="none"
      />
    </motion.svg>
  )
}

// Animated clouds
export function FloatingCloud({ className, size = 60 }: CozyIllustrationProps) {
  return (
    <motion.svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      className={cn("drop-shadow-md", className)}
      animate={{
        x: [0, 10, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <ellipse cx="20" cy="24" rx="15" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="35" cy="20" rx="12" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="48" cy="24" rx="10" ry="8" fill="white" opacity="0.9" />
      <ellipse cx="28" cy="14" rx="10" ry="8" fill="white" opacity="0.95" />
    </motion.svg>
  )
}
