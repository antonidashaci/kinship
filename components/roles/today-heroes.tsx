"use client"

import type React from "react"

import type { DomesticRole, RoleType } from "@/lib/types"
import { motion } from "framer-motion"
import { Trophy, Coffee, ChefHat, Car, BookOpen, Music, Flower2, Sparkles, PawPrint, User } from "lucide-react"

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

interface TodayHeroesProps {
  roles: (DomesticRole & { profiles: { full_name: string | null; avatar_url: string | null } })[]
}

export function TodayHeroes({ roles }: TodayHeroesProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-bold text-foreground">Today{"'"}s Heroes</h2>
      </div>

      {roles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roles.map((role, index) => {
            const Icon = roleIcons[role.role_type]
            const gradient = roleColors[role.role_type]

            return (
              <motion.div
                key={role.id}
                className="p-4 rounded-xl bg-white/60 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-foreground text-sm">{role.role_type}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {role.profiles.avatar_url ? (
                    <img src={role.profiles.avatar_url || "/placeholder.svg"} alt="" className="w-4 h-4 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground truncate">{role.profiles.full_name || "Someone"}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Trophy className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-muted-foreground text-sm">No heroes assigned yet</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to pick a role!</p>
        </div>
      )}
    </div>
  )
}
