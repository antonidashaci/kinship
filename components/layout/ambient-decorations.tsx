"use client"

import { motion } from "framer-motion"
import {
  SleepingCat,
  CuteBunny,
  CoffeeMug,
  CozyFlower,
  FloatingHeart,
  LittleBird,
  FallingLeaf,
  FloatingCloud,
} from "@/components/ui/cozy-illustrations"

interface AmbientDecorationsProps {
  variant?: "home" | "welcome" | "auth" | "minimal"
}

export function AmbientDecorations({ variant = "home" }: AmbientDecorationsProps) {
  if (variant === "minimal") return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Floating clouds */}
      <motion.div
        className="absolute top-10 left-[5%] opacity-40"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <FloatingCloud size={80} />
      </motion.div>
      <motion.div
        className="absolute top-20 right-[10%] opacity-30"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <FloatingCloud size={60} />
      </motion.div>

      {/* Sleeping cat - bottom left area */}
      {(variant === "home" || variant === "welcome") && (
        <motion.div
          className="absolute bottom-24 left-8 opacity-70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <SleepingCat size={70} />
        </motion.div>
      )}

      {/* Cute bunny - different position based on variant */}
      {variant === "welcome" && (
        <motion.div
          className="absolute bottom-32 right-12 opacity-60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <CuteBunny size={55} />
        </motion.div>
      )}

      {/* Coffee mug - cozy corner */}
      {(variant === "home" || variant === "auth") && (
        <motion.div
          className="absolute top-32 right-8 opacity-50"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 0.5, rotate: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CoffeeMug size={50} />
        </motion.div>
      )}

      {/* Little bird */}
      {variant === "home" && (
        <motion.div
          className="absolute top-40 left-[15%] opacity-60"
          animate={{
            x: [0, 30, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <LittleBird size={40} />
        </motion.div>
      )}

      {/* Flowers scattered around */}
      <motion.div
        className="absolute bottom-40 left-[20%] opacity-60"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.8, type: "spring" }}
      >
        <CozyFlower size={35} color="pink" />
      </motion.div>
      <motion.div
        className="absolute top-[45%] right-[8%] opacity-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <CozyFlower size={30} color="yellow" />
      </motion.div>
      <motion.div
        className="absolute bottom-[30%] left-[8%] opacity-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 2.2, type: "spring" }}
      >
        <CozyFlower size={25} color="purple" />
      </motion.div>

      {/* Floating hearts */}
      <div className="absolute top-[20%] right-[20%]">
        <FloatingHeart size={20} delay={0} />
      </div>
      <div className="absolute top-[60%] left-[25%]">
        <FloatingHeart size={16} delay={1.5} />
      </div>
      <div className="absolute bottom-[25%] right-[30%]">
        <FloatingHeart size={18} delay={3} />
      </div>

      {/* Falling leaves */}
      <div className="absolute top-0 left-[30%]">
        <FallingLeaf size={18} delay={0} />
      </div>
      <div className="absolute top-0 left-[60%]">
        <FallingLeaf size={22} delay={2} />
      </div>
      <div className="absolute top-0 right-[25%]">
        <FallingLeaf size={16} delay={4} />
      </div>
    </div>
  )
}
