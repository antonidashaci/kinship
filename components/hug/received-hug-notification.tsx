"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Interaction } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, Sparkles, User } from "lucide-react"
import { GlassButton } from "@/components/ui/glass-button"

interface ReceivedHugNotificationProps {
  currentUserId: string
}

interface HugWithSender extends Interaction {
  sender: { full_name: string | null; avatar_url: string | null }
}

export function ReceivedHugNotification({ currentUserId }: ReceivedHugNotificationProps) {
  const [unreadHugs, setUnreadHugs] = useState<HugWithSender[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [currentHug, setCurrentHug] = useState<HugWithSender | null>(null)

  useEffect(() => {
    const checkForUnreadHugs = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("interactions")
        .select("*, sender:profiles!sender_id(full_name, avatar_url)")
        .eq("receiver_id", currentUserId)
        .eq("interaction_type", "Digital Hug")
        .eq("is_read", false)
        .order("created_at", { ascending: false })

      if (data && data.length > 0) {
        setUnreadHugs(data as HugWithSender[])
        setCurrentHug(data[0] as HugWithSender)
        setShowNotification(true)
      }
    }

    checkForUnreadHugs()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel("hug-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "interactions",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        async (payload) => {
          if ((payload.new as Interaction).interaction_type === "Digital Hug") {
            // Fetch the sender info
            const { data: sender } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", (payload.new as Interaction).sender_id)
              .single()

            const hugWithSender = {
              ...(payload.new as Interaction),
              sender: sender || { full_name: null, avatar_url: null },
            } as HugWithSender

            setCurrentHug(hugWithSender)
            setShowNotification(true)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const handleDismiss = async () => {
    if (currentHug) {
      const supabase = createClient()
      await supabase.from("interactions").update({ is_read: true }).eq("id", currentHug.id)
    }

    setShowNotification(false)

    // Show next unread hug if any
    const remaining = unreadHugs.filter((h) => h.id !== currentHug?.id)
    setUnreadHugs(remaining)

    if (remaining.length > 0) {
      setTimeout(() => {
        setCurrentHug(remaining[0])
        setShowNotification(true)
      }, 500)
    }
  }

  return (
    <AnimatePresence>
      {showNotification && currentHug && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay with pulsing hearts background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#ff6b9d]/90 to-[#ff9a7b]/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Animated background hearts */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              >
                <Heart className="w-8 h-8" fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>

          {/* Main notification card */}
          <motion.div
            className="relative z-10 glass-panel-solid rounded-3xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sender avatar */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              {currentHug.sender.avatar_url ? (
                <img
                  src={currentHug.sender.avatar_url || "/placeholder.svg"}
                  alt={currentHug.sender.full_name || "Someone"}
                  className="w-full h-full rounded-full object-cover ring-4 ring-[#ff6b9d]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#d4e4f7] to-[#c9f0e4] flex items-center justify-center ring-4 ring-[#ff6b9d]">
                  <User className="w-12 h-12 text-emerald-600" />
                </div>
              )}

              {/* Animated heart badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ff9a7b] flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <Heart className="w-5 h-5 text-white" fill="white" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold text-foreground mb-2">You received a hug!</h2>
              <p className="text-muted-foreground mb-6">
                <span className="font-semibold text-[#ff6b9d]">{currentHug.sender.full_name || "Someone"}</span> is
                sending you love and warmth
              </p>
            </motion.div>

            {/* Sparkle decorations */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
              ))}
            </div>

            {/* Action button */}
            <GlassButton variant="love" size="lg" className="w-full" onClick={handleDismiss}>
              <Heart className="w-5 h-5 mr-2" fill="white" />
              Feel the Love
            </GlassButton>

            {/* Unread count */}
            {unreadHugs.length > 1 && (
              <p className="text-xs text-muted-foreground mt-4">+{unreadHugs.length - 1} more hugs waiting for you</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
