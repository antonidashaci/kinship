"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { MoodIndicator } from "@/components/ui/mood-indicator"
import { AbstractCharacter } from "@/components/ui/abstract-character"
import type { MoodType } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Users, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react"

type OnboardingStep = "welcome" | "create-family" | "mood" | "complete"

const moods: { type: MoodType; label: string }[] = [
  { type: "happy", label: "Happy" },
  { type: "calm", label: "Calm" },
  { type: "excited", label: "Excited" },
  { type: "loved", label: "Loved" },
  { type: "tired", label: "Tired" },
  { type: "neutral", label: "Neutral" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [familyName, setFamilyName] = useState("")
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      setError("Please enter a family name")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("[v0] User data:", user?.id, userError?.message)

      if (!user) {
        router.push("/auth/login")
        return
      }

      // First check if user already has a profile
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id, family_id")
        .eq("id", user.id)
        .maybeSingle()

      console.log("[v0] Existing profile check:", existingProfile, profileCheckError?.message)

      // If user already has a profile with a family, skip to mood step
      if (existingProfile?.family_id) {
        console.log("[v0] User already has family, skipping to mood")
        setStep("mood")
        setIsLoading(false)
        return
      }

      // Create family first
      const { data: family, error: familyError } = await supabase
        .from("families")
        .insert({ family_name: familyName.trim(), created_by: user.id })
        .select()
        .single()

      console.log("[v0] Family creation:", family, familyError?.message)

      if (familyError) throw familyError

      // Now create or update profile
      if (existingProfile) {
        // Profile exists but no family - update it
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            family_id: family.id,
            is_family_admin: true,
          })
          .eq("id", user.id)

        console.log("[v0] Profile update error:", updateError?.message)
        if (updateError) throw updateError
      } else {
        // No profile exists - create new one
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          family_id: family.id,
          is_family_admin: true,
          current_mood: null,
        })

        console.log("[v0] Profile creation error:", profileError?.message)
        if (profileError) throw profileError
      }

      setStep("mood")
    } catch (err: unknown) {
      console.log("[v0] Error in handleCreateFamily:", err)
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetMood = async () => {
    if (!selectedMood) {
      setStep("complete")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("profiles").update({ current_mood: selectedMood }).eq("id", user.id)
      }

      setStep("complete")
    } catch {
      setStep("complete")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    router.push("/home")
  }

  return (
    <MeshBackground>
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        {/* Decorative characters */}
        <div className="fixed top-24 right-20 opacity-50 animate-float">
          <AbstractCharacter variant="star" color="warm" size="lg" />
        </div>
        <div className="fixed bottom-32 left-16 opacity-40 animate-float-slow">
          <AbstractCharacter variant="cloud" color="cool" size="xl" />
        </div>
        <div className="fixed top-1/3 left-20 opacity-30">
          <AbstractCharacter variant="blob" color="mint" size="md" />
        </div>

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
            >
              <GlassCard variant="elevated" className="p-10" glowColor="warm">
                <motion.div
                  className="w-24 h-24 mx-auto rounded-[1.75rem] bg-gradient-to-br from-[#FFB699] via-[#ff8c69] to-[#e85d75] flex items-center justify-center mb-8"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 300 }}
                  style={{
                    boxShadow: "0 8px 32px rgba(255,140,105,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}
                >
                  <Home className="w-12 h-12 text-white drop-shadow-sm" />
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold text-foreground mb-3 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome Home
                </motion.h1>
                <motion.p
                  className="text-muted-foreground leading-relaxed mb-10 text-[17px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your account is ready. Let{"'"}s create your family{"'"}s cozy digital nest together.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <GlassButton variant="primary" size="lg" className="w-full" onClick={() => setStep("create-family")}>
                    Let{"'"}s Begin
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlassButton>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}

          {step === "create-family" && (
            <motion.div
              key="create-family"
              className="w-full max-w-md"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
            >
              <GlassCard variant="elevated" className="p-10" glowColor="sage">
                <div className="text-center mb-10">
                  <motion.div
                    className="w-20 h-20 mx-auto rounded-[1.5rem] bg-gradient-to-br from-[#D4EBE3] via-[#A8C5B5] to-[#8BB5A5] flex items-center justify-center mb-6"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    style={{
                      boxShadow: "0 8px 32px rgba(168,197,181,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  >
                    <Users className="w-10 h-10 text-emerald-700 drop-shadow-sm" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-foreground tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Name Your Nest
                  </motion.h2>
                  <motion.p
                    className="text-muted-foreground mt-3 text-[17px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    What should we call your family home?
                  </motion.p>
                </div>

                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <GlassInput
                    id="familyName"
                    type="text"
                    placeholder='e.g., "The Johnsons" or "Casa Smith"'
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    error={error || undefined}
                  />

                  <div className="flex gap-4">
                    <GlassButton
                      variant="soft"
                      size="md"
                      className="flex-1"
                      onClick={() => setStep("welcome")}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      size="md"
                      className="flex-1"
                      onClick={handleCreateFamily}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Nest"}
                    </GlassButton>
                  </div>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}

          {step === "mood" && (
            <motion.div
              key="mood"
              className="w-full max-w-lg"
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
            >
              <GlassCard variant="elevated" className="p-10" glowColor="love">
                <div className="text-center mb-10">
                  <motion.div
                    className="w-20 h-20 mx-auto rounded-[1.5rem] bg-gradient-to-br from-[#FFB3BE] via-[#e85d75] to-[#D14D65] flex items-center justify-center mb-6"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    style={{
                      boxShadow: "0 8px 32px rgba(232,93,117,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    <Sparkles className="w-10 h-10 text-white drop-shadow-sm" />
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-foreground tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    How are you feeling?
                  </motion.h2>
                  <motion.p
                    className="text-muted-foreground mt-3 text-[17px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Share your mood with your family
                  </motion.p>
                </div>

                <motion.div
                  className="grid grid-cols-3 gap-4 mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {moods.map((mood, i) => (
                    <motion.button
                      key={mood.type}
                      className={`p-5 rounded-[1.25rem] flex flex-col items-center gap-3 transition-all border ${
                        selectedMood === mood.type
                          ? "bg-white border-[#ff8c69]/30 shadow-[0_4px_20px_rgba(255,140,105,0.15)]"
                          : "bg-white/60 border-transparent hover:bg-white/80"
                      }`}
                      onClick={() => setSelectedMood(mood.type)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <MoodIndicator mood={mood.type} size="md" />
                      <span className="text-sm font-medium text-foreground">{mood.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <GlassButton
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => setStep("complete")}
                    disabled={isLoading}
                  >
                    Skip for now
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={handleSetMood}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Continue"}
                  </GlassButton>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.2, 0.9, 0.3, 1] }}
            >
              <GlassCard variant="elevated" className="p-10 glow-warm" glowColor="warm">
                <motion.div
                  className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#D4EBE3] via-[#A8C5B5] to-[#7DD3A8] flex items-center justify-center mb-8"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                  style={{
                    boxShadow: "0 12px 40px rgba(125,211,168,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}
                >
                  <Check className="w-14 h-14 text-emerald-700 drop-shadow-sm" strokeWidth={2.5} />
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold text-foreground mb-4 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  You{"'"}re All Set!
                </motion.h1>
                <motion.p
                  className="text-muted-foreground leading-relaxed mb-10 text-[17px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Your family{"'"}s digital home is ready. Invite your loved ones and start creating memories together.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full animate-pulse-glow"
                    onClick={handleComplete}
                  >
                    Enter Your Home
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GlassButton>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MeshBackground>
  )
}
