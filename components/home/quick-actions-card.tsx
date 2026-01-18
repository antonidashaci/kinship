"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GlassButton } from "@/components/ui/glass-button"
import { FloatingHeart, SparkleStars, CoffeeMug } from "@/components/ui/cozy-illustrations"
import type { Profile } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Coffee, Star, Briefcase, X, User, Check, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface QuickActionsCardProps {
  currentUserId: string
  familyMembers: Profile[]
}

export function QuickActionsCard({ currentUserId, familyMembers }: QuickActionsCardProps) {
  const [showHugModal, setShowHugModal] = useState(false)
  const [showGratitudeModal, setShowGratitudeModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [gratitudeMessage, setGratitudeMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const otherMembers = familyMembers.filter((m) => m.id !== currentUserId)

  const handleSendHug = async () => {
    if (!selectedMember) return

    setIsSending(true)
    const supabase = createClient()

    const member = familyMembers.find((m) => m.id === currentUserId)

    await supabase.from("interactions").insert({
      sender_id: currentUserId,
      receiver_id: selectedMember,
      family_id: member?.family_id,
      interaction_type: "Digital Hug",
      message: "Sending you a warm hug!",
    })

    setSent(true)
    setTimeout(() => {
      setShowHugModal(false)
      setSent(false)
      setSelectedMember(null)
      router.refresh()
    }, 1500)
    setIsSending(false)
  }

  const handleSendGratitude = async () => {
    if (!selectedMember) return

    setIsSending(true)
    const supabase = createClient()

    const member = familyMembers.find((m) => m.id === currentUserId)

    await supabase.from("interactions").insert({
      sender_id: currentUserId,
      receiver_id: selectedMember,
      family_id: member?.family_id,
      interaction_type: "Gratitude Ping",
      message: gratitudeMessage || "Thank you for being awesome!",
    })

    setSent(true)
    setTimeout(() => {
      setShowGratitudeModal(false)
      setSent(false)
      setSelectedMember(null)
      setGratitudeMessage("")
      router.refresh()
    }, 1500)
    setIsSending(false)
  }

  const resetModals = () => {
    setShowHugModal(false)
    setShowGratitudeModal(false)
    setSent(false)
    setSelectedMember(null)
    setGratitudeMessage("")
  }

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Sparkles className="w-5 h-5 text-[#ff6b9d]" />
        </motion.div>
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          className="relative p-4 rounded-2xl bg-gradient-to-br from-[#ff6b9d] to-[#ff9a7b] text-white text-center overflow-hidden shadow-lg shadow-pink-200/50"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHugModal(true)}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className="w-7 h-7 mx-auto mb-2" fill="white" />
          </motion.div>
          <span className="text-sm font-semibold">Send Hug</span>
        </motion.button>

        <motion.button
          className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-center overflow-hidden shadow-lg shadow-amber-200/50"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Coffee className="w-7 h-7 mx-auto mb-2" />
          </motion.div>
          <span className="text-sm font-semibold">Coffee Order</span>
        </motion.button>

        <motion.button
          className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-center overflow-hidden shadow-lg shadow-emerald-200/50"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGratitudeModal(true)}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%", skewX: -15 }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.6 }}
          />
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
            <Star className="w-7 h-7 mx-auto mb-2" />
          </motion.div>
          <span className="text-sm font-semibold">Gratitude</span>
        </motion.button>

        <Link href="/roles">
          <motion.button
            className="relative w-full p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-center overflow-hidden shadow-lg shadow-blue-200/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%", skewX: -15 }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.6 }}
            />
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Briefcase className="w-7 h-7 mx-auto mb-2" />
            </motion.div>
            <span className="text-sm font-semibold">Pick Role</span>
          </motion.button>
        </Link>
      </div>

      {/* Send Hug Modal */}
      <AnimatePresence>
        {showHugModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModals}
          >
            <motion.div
              className="glass-panel-solid rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {sent ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff9a7b] flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-bold text-foreground">Hug Sent!</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">Send a Digital Hug</h3>
                    <button onClick={resetModals} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">Who needs a warm hug today?</p>

                  <div className="space-y-2 mb-6">
                    {otherMembers.map((member) => (
                      <motion.button
                        key={member.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          selectedMember === member.id
                            ? "bg-[#ff9a7b]/20 ring-2 ring-[#ff9a7b]"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        onClick={() => setSelectedMember(member.id)}
                        whileTap={{ scale: 0.98 }}
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
                        <span className="font-medium text-foreground">{member.full_name || "Family Member"}</span>
                      </motion.button>
                    ))}
                  </div>

                  <GlassButton
                    variant="love"
                    size="lg"
                    className="w-full"
                    onClick={handleSendHug}
                    disabled={!selectedMember || isSending}
                  >
                    <Heart className="w-5 h-5 mr-2" fill="white" />
                    {isSending ? "Sending..." : "Send Hug"}
                  </GlassButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gratitude Modal */}
      <AnimatePresence>
        {showGratitudeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModals}
          >
            <motion.div
              className="glass-panel-solid rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {sent ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-bold text-foreground">Gratitude Sent!</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-foreground">Send Gratitude</h3>
                    <button onClick={resetModals} className="p-2 rounded-full hover:bg-white/50 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">Who are you grateful for?</p>

                  <div className="space-y-2 mb-4">
                    {otherMembers.map((member) => (
                      <motion.button
                        key={member.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          selectedMember === member.id
                            ? "bg-emerald-100 ring-2 ring-emerald-400"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        onClick={() => setSelectedMember(member.id)}
                        whileTap={{ scale: 0.98 }}
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
                        <span className="font-medium text-foreground">{member.full_name || "Family Member"}</span>
                      </motion.button>
                    ))}
                  </div>

                  <textarea
                    className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 resize-none"
                    placeholder="Why are you grateful? (optional)"
                    rows={2}
                    value={gratitudeMessage}
                    onChange={(e) => setGratitudeMessage(e.target.value)}
                  />

                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    onClick={handleSendGratitude}
                    disabled={!selectedMember || isSending}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    {isSending ? "Sending..." : "Send Gratitude"}
                  </GlassButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
