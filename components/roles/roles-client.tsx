"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MeshBackground } from "@/components/layout/mesh-background"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { RoleCarousel } from "@/components/roles/role-carousel"
import { TodayHeroes } from "@/components/roles/today-heroes"
import type { Profile, Family, DomesticRole, RoleType } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles, Check } from "lucide-react"
import Link from "next/link"

interface RolesClientProps {
  currentUser: Profile
  family: Family
  todayRoles: (DomesticRole & { profiles: { full_name: string | null; avatar_url: string | null } })[]
  myRole: DomesticRole | null
  familyMembers: Profile[]
}

export function RolesClient({ currentUser, family, todayRoles, myRole, familyMembers }: RolesClientProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(myRole?.role_type || null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const takenRoles = todayRoles.filter((r) => r.user_id !== currentUser.id).map((r) => r.role_type)

  const handleAssignRole = async () => {
    if (!selectedRole) return

    setIsAssigning(true)

    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Remove existing role for today if any
    if (myRole) {
      await supabase.from("domestic_roles").update({ is_active: false }).eq("id", myRole.id)
    }

    // Assign new role
    const { error } = await supabase.from("domestic_roles").insert({
      user_id: currentUser.id,
      family_id: family.id,
      role_type: selectedRole,
      assigned_date: today,
      is_active: true,
    })

    if (!error) {
      setShowSuccess(true)
      setTimeout(() => {
        router.push("/home")
      }, 1500)
    }

    setIsAssigning(false)
  }

  return (
    <MeshBackground>
      <div className="min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel-solid">
          <div className="px-4 md:px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                href="/home"
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold text-foreground">Hero Roles</h1>
                <p className="text-sm text-muted-foreground">Pick your role for today</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 md:px-8 max-w-4xl mx-auto py-8">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                className="flex flex-col items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlassCard variant="glow" className="p-10 text-center max-w-md">
                  <motion.div
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#c9f0e4] to-[#95D5B2] flex items-center justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Check className="w-10 h-10 text-emerald-700" strokeWidth={3} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    You{"'"}re the {selectedRole}!
                  </h2>
                  <p className="text-muted-foreground">Your family knows they can count on you today.</p>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="picker"
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Current role badge */}
                {myRole && (
                  <GlassCard className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-foreground">
                        You{"'"}re currently the <span className="text-[#ff9a7b] font-bold">{myRole.role_type}</span>
                      </span>
                    </div>
                  </GlassCard>
                )}

                {/* Role carousel */}
                <GlassCard variant="solid" className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 text-center">Choose Your Hero Role</h2>
                  <RoleCarousel
                    selectedRole={selectedRole}
                    onSelectRole={setSelectedRole}
                    takenRoles={takenRoles}
                    familyRoles={todayRoles}
                  />

                  <div className="mt-6">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleAssignRole}
                      disabled={!selectedRole || isAssigning}
                    >
                      {isAssigning ? "Becoming hero..." : selectedRole ? `Become the ${selectedRole}` : "Select a role"}
                    </GlassButton>
                  </div>
                </GlassCard>

                {/* Today's heroes */}
                <GlassCard variant="solid" className="p-6">
                  <TodayHeroes roles={todayRoles} />
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </MeshBackground>
  )
}
