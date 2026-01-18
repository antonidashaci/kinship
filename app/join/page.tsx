"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { AbstractCharacter } from "@/components/ui/abstract-character"
import { motion } from "framer-motion"
import Link from "next/link"
import { Users, ArrowLeft } from "lucide-react"

export default function JoinFamilyPage() {
  const [inviteCode, setInviteCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) {
      setError("Please enter an invite code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // User needs to sign up first with the invite code in state
        router.push(`/auth/sign-up?invite=${inviteCode.trim()}`)
        return
      }

      // Check if user already has a profile
      const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (existingProfile?.family_id) {
        setError("You're already part of a family")
        setIsLoading(false)
        return
      }

      // Find family by invite code
      const { data: family, error: familyError } = await supabase
        .from("families")
        .select("*")
        .eq("invite_code", inviteCode.trim().toUpperCase())
        .single()

      if (familyError || !family) {
        setError("Invalid invite code. Please check and try again.")
        setIsLoading(false)
        return
      }

      // Update or create profile
      if (existingProfile) {
        await supabase.from("profiles").update({ family_id: family.id }).eq("id", user.id)
      } else {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          family_id: family.id,
          is_family_admin: false,
        })
      }

      router.push("/home")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MeshBackground variant="calm">
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Floating characters */}
        <div className="fixed top-28 right-20 opacity-50">
          <AbstractCharacter variant="heart" color="love" size="md" />
        </div>
        <div className="fixed bottom-24 left-16 opacity-40">
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
                className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#d4e4f7] to-[#c9f0e4] flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <Users className="w-7 h-7 text-emerald-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground">Join a Family</h1>
              <p className="text-muted-foreground mt-2">Enter the invite code shared by your family member</p>
            </div>

            {/* Form */}
            <form onSubmit={handleJoin} className="space-y-5">
              <GlassInput
                id="inviteCode"
                type="text"
                label="Invite Code"
                placeholder="Enter 8-character code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="text-center tracking-widest text-lg font-mono"
                maxLength={8}
                error={error || undefined}
              />

              <GlassButton type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Family"}
              </GlassButton>
            </form>

            {/* Create family link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Want to create your own family?{" "}
              <Link href="/auth/sign-up" className="text-[#ff9a7b] font-medium hover:underline">
                Start a new nest
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </MeshBackground>
  )
}
