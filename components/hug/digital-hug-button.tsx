"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, User, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface DigitalHugButtonProps {
  currentUserId: string
  familyId: string
  familyMembers: Profile[]
}

export function DigitalHugButton({ currentUserId, familyId, familyMembers }: DigitalHugButtonProps) {
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [showHugAnimation, setShowHugAnimation] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  const otherMembers = familyMembers.filter((m) => m.id !== currentUserId)

  const handleHoldStart = useCallback(() => {
    if (!selectedMember) return

    setIsHolding(true)
    setHoldProgress(0)

    const interval = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          handleSendHug()
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [selectedMember])

  const handleHoldEnd = useCallback(() => {
    setIsHolding(false)
    if (holdProgress < 100) {
      setHoldProgress(0)
    }
  }, [holdProgress])

  const handleSendHug = async () => {
    if (!selectedMember) return

    setIsSending(true)
    setShowHugAnimation(true)

    const supabase = createClient()

    await supabase.from("interactions").insert({
      sender_id: currentUserId,
      receiver_id: selectedMember,
      family_id: familyId,
      interaction_type: "Digital Hug",
      message: "Sending you a warm, heartfelt hug!",
    })

    // Wait for animation
    setTimeout(() => {
      setShowHugAnimation(false)
      setShowModal(false)
      setSelectedMember(null)
      setHoldProgress(0)
      setIsSending(false)
      router.refresh()
    }, 3000)
  }

  return (
    <>
      {/* Floating hug button */}
      <motion.button
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff9a7b] shadow-xl flex items-center justify-center glow-love"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        aria-label="Send a digital hug"
      >
        <Heart className="w-8 h-8 text-white" fill="white" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && !showHugAnimation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="glass-panel-solid rounded-3xl p-8 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-[#ff6b9d]" fill="#ff6b9d" />
                  <h3 className="text-xl font-bold text-foreground">Digital Hug</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                Select someone and hold the heart button to send them a warm, loving hug.
              </p>

              {/* Family member selection */}
              <div className="space-y-2 mb-8">
                {otherMembers.map((member) => (
                  <motion.button
                    key={member.id}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                      selectedMember === member.id
                        ? "bg-gradient-to-r from-[#ff6b9d]/20 to-[#ff9a7b]/20 ring-2 ring-[#ff6b9d]"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    onClick={() => setSelectedMember(member.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url || "/placeholder.svg"}
                        alt={member.full_name || "User"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4e4f7] to-[#c9f0e4] flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-600" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{member.full_name || "Family Member"}</p>
                      {selectedMember === member.id && <p className="text-xs text-[#ff6b9d]">Selected for hug</p>}
                    </div>
                    {selectedMember === member.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-[#ff6b9d] flex items-center justify-center"
                      >
                        <Heart className="w-3 h-3 text-white" fill="white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Hold to send button */}
              <div className="relative">
                <motion.button
                  className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-semibold text-white transition-all ${
                    selectedMember ? "bg-gradient-to-r from-[#ff6b9d] to-[#ff9a7b]" : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!selectedMember || isSending}
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  whileHover={selectedMember ? { scale: 1.02 } : {}}
                  whileTap={selectedMember ? { scale: 0.98 } : {}}
                  style={{
                    background: selectedMember
                      ? `linear-gradient(to right, #ff6b9d ${holdProgress}%, rgba(255,107,157,0.3) ${holdProgress}%)`
                      : undefined,
                  }}
                >
                  <Heart className={`w-6 h-6 ${isHolding ? "animate-pulse" : ""}`} fill="white" />
                  <span>{isHolding ? "Keep holding..." : "Hold to Send Hug"}</span>
                </motion.button>

                {/* Progress ring */}
                {isHolding && holdProgress > 0 && (
                  <motion.div
                    className="absolute -inset-1 rounded-3xl border-4 border-[#ff6b9d] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      clipPath: `polygon(0 0, ${holdProgress}% 0, ${holdProgress}% 100%, 0 100%)`,
                    }}
                  />
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">Hold for 1.5 seconds to send your love</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen hug animation */}
      <AnimatePresence>
        {showHugAnimation && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#ff6b9d] to-[#ff9a7b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating hearts */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * window.innerWidth - window.innerWidth / 2,
                  y: window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 0.8,
                }}
                animate={{
                  y: -100,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              >
                <Heart
                  className="text-white/60"
                  fill="currentColor"
                  style={{ width: 20 + Math.random() * 40, height: 20 + Math.random() * 40 }}
                />
              </motion.div>
            ))}

            {/* Center heart */}
            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
            >
              <motion.div
                className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-20 h-20 text-white" fill="white" />
              </motion.div>

              {/* Sparkles around heart */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 100,
                    y: Math.sin((i * Math.PI * 2) / 8) * 100,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>

            {/* Message */}
            <motion.div
              className="absolute bottom-20 text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-2xl font-bold mb-2">Hug Sent!</p>
              <p className="text-white/80">Your love is on its way</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
