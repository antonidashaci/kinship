"use client"

import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCard } from "@/components/ui/glass-card"
import { AbstractCharacter } from "@/components/ui/abstract-character"
import { SleepingCat, CuteBunny, CoffeeMug, CozyFlower, SparkleStars } from "@/components/ui/cozy-illustrations"
import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Users, Sparkles } from "lucide-react"

export default function WelcomePage() {
  return (
    <MeshBackground decorations="welcome">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Floating abstract shapes */}
        <motion.div
          className="fixed top-16 left-8 opacity-50"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <AbstractCharacter variant="cloud" color="cool" size="lg" />
        </motion.div>
        <motion.div
          className="fixed top-32 right-16 opacity-40"
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        >
          <AbstractCharacter variant="heart" color="love" size="md" />
        </motion.div>
        <motion.div
          className="fixed bottom-40 left-16 opacity-40"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <AbstractCharacter variant="star" color="warm" size="sm" />
        </motion.div>

        {/* Main content */}
        <motion.div
          className="max-w-lg w-full text-center space-y-8 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Logo and title */}
          <div className="space-y-4">
            <motion.div
              className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#ff9a7b] to-[#ff6b9d] flex items-center justify-center shadow-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Heart className="w-10 h-10 text-white" fill="white" />
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-foreground tracking-tight text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to <span className="text-gradient-warm">Kinship</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground text-pretty leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your family{"'"}s digital home. A cozy space to coordinate, connect, and care for each other.
            </motion.p>
          </div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-4 text-center" hover={false}>
              <Sparkles className="w-6 h-6 mx-auto text-amber-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground">Mood Sharing</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" hover={false}>
              <Users className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground">Family Roles</p>
            </GlassCard>
            <GlassCard className="p-4 text-center" hover={false}>
              <Heart className="w-6 h-6 mx-auto text-pink-500 mb-2" />
              <p className="text-xs font-medium text-muted-foreground">Digital Hugs</p>
            </GlassCard>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="space-y-4 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/auth/sign-up" className="block">
              <GlassButton variant="primary" size="lg" className="w-full">
                Create Your Digital Nest
              </GlassButton>
            </Link>

            <Link href="/auth/login" className="block">
              <GlassButton variant="secondary" size="lg" className="w-full">
                Sign In to Your Home
              </GlassButton>
            </Link>
          </motion.div>

          {/* Join family link */}
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Have an invite code?{" "}
            <Link href="/join" className="text-[#ff9a7b] font-medium hover:underline">
              Join a family
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </MeshBackground>
  )
}
