"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { AbstractCharacter } from "@/components/ui/abstract-character"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/onboarding`,
        },
      })

      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MeshBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Floating characters */}
        <div className="fixed top-32 right-16 opacity-50">
          <AbstractCharacter variant="heart" color="love" size="md" />
        </div>
        <div className="fixed bottom-20 left-16 opacity-40">
          <AbstractCharacter variant="blob" color="calm" size="lg" />
        </div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Back link */}
          <Link
            href="/welcome"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <GlassCard variant="solid" className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#ff9a7b] to-[#ff6b9d] flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <Heart className="w-7 h-7 text-white" fill="white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground">Create Your Nest</h1>
              <p className="text-muted-foreground mt-2">Start building your family{"'"}s digital home</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-5">
              <GlassInput
                id="fullName"
                type="text"
                label="Your Name"
                placeholder="What should we call you?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <GlassInput
                id="email"
                type="email"
                label="Email"
                placeholder="hello@family.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <GlassInput
                id="password"
                type="password"
                label="Password"
                placeholder="Create a cozy password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <GlassInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Type it again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <motion.p
                  className="text-sm text-red-500 text-center bg-red-50 rounded-xl p-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <GlassButton type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating your nest..." : "Create Account"}
              </GlassButton>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have a home?{" "}
              <Link href="/auth/login" className="text-[#ff9a7b] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </MeshBackground>
  )
}
