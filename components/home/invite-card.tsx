"use client"

import { useState } from "react"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Copy, Check, Mail, Phone, Send, X, Share2 } from "lucide-react"

interface InviteCardProps {
  inviteCode: string
  familyName?: string
}

export function InviteCard({ inviteCode, familyName = "our family" }: InviteCardProps) {
  const [copied, setCopied] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteMethod, setInviteMethod] = useState<"email" | "sms" | null>(null)
  const [contactInput, setContactInput] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: "Join our family on Kinship",
      text: `You're invited to join ${familyName} on Kinship! Use invite code: ${inviteCode}`,
      url: `${window.location.origin}/join?code=${inviteCode}`,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error
      }
    } else {
      setShowInviteModal(true)
    }
  }

  const handleSendInvite = async () => {
    if (!contactInput.trim()) return

    setSending(true)

    // Simulate sending (in production, connect to email/SMS service)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (inviteMethod === "email") {
      // Open default email client with pre-filled content
      const subject = encodeURIComponent(`You're invited to join ${familyName} on Kinship!`)
      const body = encodeURIComponent(
        `Hey!\n\nI'd love for you to join our family on Kinship - it's a beautiful app that helps families stay emotionally connected.\n\nUse this invite code to join: ${inviteCode}\n\nOr click here: ${window.location.origin}/join?code=${inviteCode}\n\nSee you in the nest!`
      )
      window.open(`mailto:${contactInput}?subject=${subject}&body=${body}`)
    } else if (inviteMethod === "sms") {
      // Open default SMS app with pre-filled content
      const smsBody = encodeURIComponent(
        `Join ${familyName} on Kinship! Use code: ${inviteCode} or tap: ${window.location.origin}/join?code=${inviteCode}`
      )
      window.open(`sms:${contactInput}?body=${smsBody}`)
    }

    setSending(false)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setContactInput("")
      setInviteMethod(null)
      setShowInviteModal(false)
    }, 2000)
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-[#ff6b9d]" />
          <h2 className="text-lg font-bold text-foreground">Invite Family</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">Share this code with family members to join your nest</p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 px-4 py-3 rounded-xl bg-white/60 border border-white/40">
            <p className="text-lg font-mono font-bold tracking-widest text-center text-foreground">{inviteCode}</p>
          </div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <GlassButton variant="secondary" size="md" onClick={handleCopy}>
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </GlassButton>
          </motion.div>
        </div>

        <div className="mt-auto">
          <GlassButton variant="primary" size="md" className="w-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Send Invite
          </GlassButton>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Invite to Your Nest</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {!inviteMethod ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">How would you like to send the invite?</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInviteMethod("email")}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#ff9a7b]/20 to-[#ff6b9d]/20 border border-white/40 hover:border-[#ff9a7b]/40 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff9a7b] to-[#ff6b9d] flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">Send a warm email invitation</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInviteMethod("sms")}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#7dd3fc]/20 to-[#a78bfa]/20 border border-white/40 hover:border-[#7dd3fc]/40 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3fc] to-[#a78bfa] flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">SMS / Text</p>
                      <p className="text-sm text-muted-foreground">Send a quick text message</p>
                    </div>
                  </motion.button>

                  <div className="pt-4 border-t border-black/5 mt-4">
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl hover:bg-black/5 transition-colors text-muted-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Just copy the code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setInviteMethod(null)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Back
                  </button>

                  <GlassInput
                    label={inviteMethod === "email" ? "Email Address" : "Phone Number"}
                    type={inviteMethod === "email" ? "email" : "tel"}
                    placeholder={inviteMethod === "email" ? "loved.one@example.com" : "+90 555 123 4567"}
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    autoFocus
                  />

                  <div className="p-4 rounded-2xl bg-[#fef3c7]/50 border border-[#fcd34d]/30">
                    <p className="text-sm text-[#92400e]">
                      <span className="font-medium">Preview:</span> They'll receive a warm invitation with your family
                      code <span className="font-mono font-bold">{inviteCode}</span> and a direct link to join.
                    </p>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleSendInvite}
                    disabled={!contactInput.trim() || sending}
                  >
                    {sent ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Invite Sent!
                      </>
                    ) : sending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Opening {inviteMethod === "email" ? "Email" : "Messages"}...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send {inviteMethod === "email" ? "Email" : "Text"} Invite
                      </>
                    )}
                  </GlassButton>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
