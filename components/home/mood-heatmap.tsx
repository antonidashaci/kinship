"use client"

import { MoodIndicator } from "@/components/ui/mood-indicator"
import type { Profile, MoodType } from "@/lib/types"
import { motion } from "framer-motion"
import { Sparkles, User } from "lucide-react"

interface MoodHeatmapProps {
  familyMembers: Profile[]
}

const moodColors: Record<MoodType, string> = {
  happy: "#FFD93D",
  calm: "#95D5B2",
  tired: "#B8B8D1",
  stressed: "#FF8FA3",
  excited: "#FFB347",
  sad: "#89CFF0",
  loved: "#FF6B9D",
  neutral: "#E8E8E8",
}

export function MoodHeatmap({ familyMembers }: MoodHeatmapProps) {
  const moodCounts = familyMembers.reduce(
    (acc, member) => {
      const mood = member.current_mood || "neutral"
      acc[mood] = (acc[mood] || 0) + 1
      return acc
    },
    {} as Record<MoodType, number>,
  )

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodType | undefined

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#ff9a7b]" />
        <h2 className="text-lg font-bold text-foreground">Family Vibe</h2>
      </div>

      {/* Mood visualization */}
      <div className="flex flex-col gap-4">
        {/* Dominant mood indicator */}
        {dominantMood && (
          <motion.div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: `${moodColors[dominantMood]}20` }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MoodIndicator mood={dominantMood} size="lg" />
            <div>
              <p className="text-sm text-muted-foreground">Overall vibe</p>
              <p className="font-bold text-foreground capitalize">{dominantMood}</p>
            </div>
          </motion.div>
        )}

        {/* Family members mood grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {familyMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {member.avatar_url ? (
                <img
                  src={member.avatar_url || "/placeholder.svg"}
                  alt={member.full_name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4e4f7] to-[#c9f0e4] flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{member.full_name || "Family Member"}</p>
              </div>
              <MoodIndicator mood={member.current_mood} size="sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
