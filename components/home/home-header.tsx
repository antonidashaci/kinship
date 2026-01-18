"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MoodIndicator } from "@/components/ui/mood-indicator"
import { GlassButton } from "@/components/ui/glass-button"
import type { Profile, MoodType } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Settings, LogOut, ChevronDown } from "lucide-react"

interface HomeHeaderProps {
  currentUser: Profile
  familyName: string
}

const moods: { type: MoodType; label: string }[] = [
  { type: "happy", label: "Happy" },
  { type: "calm", label: "Calm" },
  { type: "excited", label: "Excited" },
  { type: "loved", label: "Loved" },
  { type: "tired", label: "Tired" },
  { type: "stressed", label: "Stressed" },
  { type: "sad", label: "Sad" },
  { type: "neutral", label: "Neutral" },
]

export function HomeHeader({ currentUser, familyName }: HomeHeaderProps) {
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  const [currentMood, setCurrentMood] = useState<MoodType | null>(currentUser.current_mood)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const handleMoodChange = async (mood: MoodType) => {
    setCurrentMood(mood)
    setShowMoodPicker(false)

    const supabase = createClient()
    await supabase.from("profiles").update({ current_mood: mood }).eq("id", currentUser.id)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/welcome")
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <header className="sticky top-0 z-50 glass-panel-solid">
      <div className="px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and family name */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff9a7b] to-[#ff6b9d] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5 text-white" fill="white" />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">{greeting()}</p>
              <h1 className="font-bold text-foreground">{familyName}</h1>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Mood selector */}
            <div className="relative">
              <motion.button
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
                onClick={() => setShowMoodPicker(!showMoodPicker)}
                whileTap={{ scale: 0.95 }}
              >
                <MoodIndicator mood={currentMood} size="sm" />
                <ChevronDown className={`w-4 h-4 transition-transform ${showMoodPicker ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showMoodPicker && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 glass-panel-solid rounded-2xl p-4 w-64"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-3">How are you feeling?</p>
                    <div className="grid grid-cols-4 gap-2">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood.type}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1 ${
                            currentMood === mood.type ? "bg-[#ff9a7b]/20" : "hover:bg-white/50"
                          }`}
                          onClick={() => handleMoodChange(mood.type)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MoodIndicator mood={mood.type} size="sm" />
                          <span className="text-[10px] text-muted-foreground">{mood.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu */}
            <div className="relative">
              <GlassButton variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}>
                <Settings className="w-5 h-5" />
              </GlassButton>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 glass-panel-solid rounded-2xl overflow-hidden min-w-[160px]"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="w-full px-4 py-3 text-left text-sm hover:bg-white/50 transition-colors flex items-center gap-2 text-red-500"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
