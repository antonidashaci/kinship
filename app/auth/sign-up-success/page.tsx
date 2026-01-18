"use client"

import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { AbstractCharacter } from "@/components/ui/abstract-character"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Sparkles } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <MeshBackground variant="calm">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Celebration characters */}
        <div className="fixed top-20 left-1/4 opacity-60">
          <AbstractCharacter variant="star" color="warm" size="md" />
        </div>
        <div className="fixed top-32 right-1/4 opacity-50">
          <AbstractCharacter variant="heart" color="love" size="sm" />
        </div>
        <div className="fixed bottom-32 left-20 opacity-40">
          <AbstractCharacter variant="cloud" color="cool" size="lg" />
        </div>

        <motion.div
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <GlassCard variant="solid" className="p-10">
            {/* Success icon */}
            <motion.div
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#c9f0e4] to-[#95D5B2] flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Mail className="w-10 h-10 text-emerald-700" />
            </motion.div>

            {/* Message */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h1 className="text-2xl font-bold text-foreground mb-3">Check Your Mailbox!</h1>
              <p className="text-muted-foreground leading-relaxed">
                We sent a warm welcome email to confirm your account. Click the link inside to start building your
                family{"'"}s digital home.
              </p>
            </motion.div>

            {/* Sparkle decoration */}
            <motion.div
              className="flex items-center justify-center gap-2 my-8 text-[#ff9a7b]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Your nest is almost ready</span>
              <Sparkles className="w-5 h-5" />
            </motion.div>

            {/* Back to login */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link href="/auth/login">
                <GlassButton variant="secondary" size="lg" className="w-full">
                  Back to Sign In
                </GlassButton>
              </Link>
            </motion.div>
          </GlassCard>

          {/* Help text */}
          <motion.p
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Didn{"'"}t receive the email? Check your spam folder or{" "}
            <Link href="/auth/sign-up" className="text-[#ff9a7b] hover:underline">
              try again
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </MeshBackground>
  )
}
