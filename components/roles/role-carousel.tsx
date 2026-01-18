"use client"

import type React from "react"

import { useRef } from "react"
import type { RoleType, DomesticRole } from "@/lib/types"
import { motion } from "framer-motion"
import {
  Coffee,
  ChefHat,
  Car,
  BookOpen,
  Music,
  Flower2,
  Sparkles,
  PawPrint,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface RoleCarouselProps {
  selectedRole: RoleType | null
  onSelectRole: (role: RoleType) => void
  takenRoles: RoleType[]
  familyRoles: (DomesticRole & { profiles: { full_name: string | null; avatar_url: string | null } })[]
}

const roles: { type: RoleType; icon: React.ElementType; gradient: string; description: string }[] = [
  { type: "Barista", icon: Coffee, gradient: "from-amber-400 to-orange-500", description: "Make morning magic" },
  { type: "Chef", icon: ChefHat, gradient: "from-red-400 to-rose-500", description: "Feed the family" },
  { type: "Driver", icon: Car, gradient: "from-blue-400 to-indigo-500", description: "Get everyone places" },
  { type: "Librarian", icon: BookOpen, gradient: "from-emerald-400 to-teal-500", description: "Help with homework" },
  { type: "DJ", icon: Music, gradient: "from-purple-400 to-pink-500", description: "Set the mood" },
  { type: "Gardener", icon: Flower2, gradient: "from-green-400 to-emerald-500", description: "Tend the plants" },
  { type: "Cleaner", icon: Sparkles, gradient: "from-cyan-400 to-blue-500", description: "Keep it tidy" },
  { type: "Pet Carer", icon: PawPrint, gradient: "from-amber-400 to-yellow-500", description: "Love the pets" },
]

export function RoleCarousel({ selectedRole, onSelectRole, takenRoles, familyRoles }: RoleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const getRoleTaker = (roleType: RoleType) => {
    const role = familyRoles.find((r) => r.role_type === roleType)
    return role?.profiles.full_name
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors hidden md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors hidden md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 md:px-10 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {roles.map((role, index) => {
          const Icon = role.icon
          const isTaken = takenRoles.includes(role.type)
          const isSelected = selectedRole === role.type
          const takerName = getRoleTaker(role.type)

          return (
            <motion.button
              key={role.type}
              className={`flex-shrink-0 w-32 snap-center p-4 rounded-2xl text-center transition-all ${
                isSelected
                  ? "ring-2 ring-[#ff9a7b] bg-[#ff9a7b]/10"
                  : isTaken
                    ? "bg-gray-100 opacity-60"
                    : "bg-white/60 hover:bg-white/80"
              }`}
              onClick={() => !isTaken && onSelectRole(role.type)}
              disabled={isTaken}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isTaken ? { scale: 1.05 } : {}}
              whileTap={!isTaken ? { scale: 0.95 } : {}}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-3 ${
                  isTaken ? "grayscale" : ""
                }`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              <p className="font-bold text-foreground text-sm mb-1">{role.type}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{role.description}</p>

              {isTaken && takerName && (
                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span className="truncate">{takerName}</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
