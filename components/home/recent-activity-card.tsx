"use client"

import type React from "react"

import type { Interaction } from "@/lib/types"
import { motion } from "framer-motion"
import { Activity, Heart, Coffee, Star, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const interactionIcons: Record<string, React.ElementType> = {
  "Digital Hug": Heart,
  "Gratitude Ping": Star,
  "Barista Order": Coffee,
  "Chef Order": Coffee,
  "Driver Request": Coffee,
  "Librarian Request": Coffee,
}

const interactionColors: Record<string, string> = {
  "Digital Hug": "text-pink-500 bg-pink-100",
  "Gratitude Ping": "text-amber-500 bg-amber-100",
  "Barista Order": "text-orange-500 bg-orange-100",
  "Chef Order": "text-red-500 bg-red-100",
  "Driver Request": "text-blue-500 bg-blue-100",
  "Librarian Request": "text-emerald-500 bg-emerald-100",
}

interface RecentActivityCardProps {
  interactions: (Interaction & {
    sender: { full_name: string | null; avatar_url: string | null }
    receiver: { full_name: string | null; avatar_url: string | null }
  })[]
}

export function RecentActivityCard({ interactions }: RecentActivityCardProps) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#ff9a7b]" />
        <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
      </div>

      {interactions.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
          {interactions.map((interaction, index) => {
            const Icon = interactionIcons[interaction.interaction_type] || Heart
            const colorClass = interactionColors[interaction.interaction_type] || "text-gray-500 bg-gray-100"

            return (
              <motion.div
                key={interaction.id}
                className="flex-shrink-0 w-48 p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" fill="currentColor" />
                </div>

                <p className="text-sm font-medium text-foreground mb-1">{interaction.interaction_type}</p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {interaction.sender.avatar_url ? (
                    <img
                      src={interaction.sender.avatar_url || "/placeholder.svg"}
                      alt=""
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="truncate">{interaction.sender.full_name || "Someone"}</span>
                  <span>to</span>
                  <span className="truncate">{interaction.receiver.full_name || "Someone"}</span>
                </div>

                <p className="text-[10px] text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(interaction.created_at), { addSuffix: true })}
                </p>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-muted-foreground text-sm">No recent activity</p>
          <p className="text-xs text-muted-foreground mt-1">Send a hug to get started!</p>
        </div>
      )}
    </div>
  )
}
