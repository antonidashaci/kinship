"use client"

import type React from "react"

import type { DomesticRole, RoleType } from "@/lib/types"
import { motion } from "framer-motion"
import { Briefcase, Coffee, ChefHat, Car, BookOpen, Music, Flower2, Sparkles, PawPrint, User } from "lucide-react"

const roleIcons: Record<RoleType, React.ElementType> = {
  Barista: Coffee,
  Chef: ChefHat,
  Driver: Car,
  Librarian: BookOpen,
  DJ: Music,
  Gardener: Flower2,
  Cleaner: Sparkles,
  "Pet Carer": PawPrint,
}

const roleColors: Record<RoleType, string> = {
  Barista: "from-amber-400 to-orange-500",
  Chef: "from-red-400 to-rose-500",
  Driver: "from-blue-400 to-indigo-500",
  Librarian: "from-emerald-400 to-teal-500",
  DJ: "from-purple-400 to-pink-500",
  Gardener: "from-green-400 to-emerald-500",
  Cleaner: "from-cyan-400 to-blue-500",
  "Pet Carer": "from-amber-400 to-yellow-500",
}

interface ActiveRolesCardProps {
  activeRoles: (DomesticRole & { profiles: { full_name: string | null; avatar_url: string | null } })[]
}

export function ActiveRolesCard({ activeRoles }: ActiveRolesCardProps) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-bold text-foreground">Today{"'"}s Heroes</h2>
      </div>

      {activeRoles.length > 0 ? (
        <div className="space-y-3">
          {activeRoles.map((role, index) => {
            const Icon = roleIcons[role.role_type]
            const gradient = roleColors[role.role_type]

            return (
              <motion.div
                key={role.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/40"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{role.role_type}</p>
                  <p className="text-sm text-muted-foreground truncate">{role.profiles.full_name || "Family Member"}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-muted-foreground text-sm">No roles assigned today</p>
          <p className="text-xs text-muted-foreground mt-1">Pick your hero role!</p>
        </div>
      )}
    </div>
  )
}
