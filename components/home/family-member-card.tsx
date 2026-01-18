"use client"

import type { Profile } from "@/lib/types"
import { MoodIndicator } from "@/components/ui/mood-indicator"
import { motion } from "framer-motion"
import { Users, User, Crown } from "lucide-react"

interface FamilyMemberCardProps {
  familyMembers: Profile[]
  currentUserId: string
}

export function FamilyMemberCard({ familyMembers, currentUserId }: FamilyMemberCardProps) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-foreground">Family</h2>
        <span className="text-sm text-muted-foreground">({familyMembers.length})</span>
      </div>

      <div className="space-y-2">
        {familyMembers.map((member, index) => (
          <motion.div
            key={member.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              member.id === currentUserId ? "bg-[#ff9a7b]/10" : "bg-white/40 hover:bg-white/60"
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {member.avatar_url ? (
              <img
                src={member.avatar_url || "/placeholder.svg"}
                alt={member.full_name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4e4f7] to-[#c9f0e4] flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {member.full_name || "Family Member"}
                  {member.id === currentUserId && <span className="text-muted-foreground"> (you)</span>}
                </p>
                {member.is_family_admin && <Crown className="w-4 h-4 text-amber-500" />}
              </div>
            </div>

            <MoodIndicator mood={member.current_mood} size="sm" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
