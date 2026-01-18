"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Send, Sparkles, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { GratitudeNote, Profile } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface GratitudeWallClientProps {
    notes: GratitudeNote[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

export function GratitudeWallClient({
    notes: initialNotes,
    familyMembers,
    currentUserId,
    familyId,
}: GratitudeWallClientProps) {
    const [notes, setNotes] = useState<GratitudeNote[]>(initialNotes)
    const [showComposer, setShowComposer] = useState(false)
    const [message, setMessage] = useState("")
    const [recipientId, setRecipientId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!message.trim()) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("gratitude_notes")
            .insert({
                family_id: familyId,
                author_id: currentUserId,
                recipient_id: recipientId,
                message: message.trim(),
            })
            .select("*, author:profiles!author_id(full_name, avatar_url), recipient:profiles!recipient_id(full_name, avatar_url)")
            .single()

        if (!error && data) {
            setNotes([data, ...notes])
            setMessage("")
            setRecipientId(null)
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (noteId: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("gratitude_notes")
            .delete()
            .eq("id", noteId)

        if (!error) {
            setNotes(notes.filter((n) => n.id !== noteId))
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                        Gratitude Wall
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Share appreciation with your family
                    </p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Heart className="w-4 h-4 mr-2" />
                    Share Gratitude
                </GlassButton>
            </div>

            {/* Composer Modal */}
            <AnimatePresence>
                {showComposer && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowComposer(false)}
                    >
                        <motion.div
                            className="glass-panel-solid rounded-3xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Share Your Gratitude</h3>
                                <button
                                    onClick={() => setShowComposer(false)}
                                    className="p-2 rounded-full hover:bg-white/20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Recipient Selector */}
                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">
                                    To (optional)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${recipientId === null
                                                ? "bg-gradient-to-r from-[#ff9a7b] to-[#ff6b9d] text-white"
                                                : "bg-white/30 hover:bg-white/50"
                                            }`}
                                        onClick={() => setRecipientId(null)}
                                    >
                                        Everyone
                                    </button>
                                    {familyMembers
                                        .filter((m) => m.id !== currentUserId)
                                        .map((member) => (
                                            <button
                                                key={member.id}
                                                className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-2 ${recipientId === member.id
                                                        ? "bg-gradient-to-r from-[#ff9a7b] to-[#ff6b9d] text-white"
                                                        : "bg-white/30 hover:bg-white/50"
                                                    }`}
                                                onClick={() => setRecipientId(member.id)}
                                            >
                                                <Avatar className="w-5 h-5">
                                                    <AvatarImage src={member.avatar_url || undefined} />
                                                    <AvatarFallback className="text-xs">
                                                        {member.full_name?.[0] || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {member.full_name?.split(" ")[0]}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">
                                    Your message
                                </label>
                                <textarea
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-[#ff9a7b] resize-none"
                                    rows={4}
                                    placeholder="I'm grateful for..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <GlassButton
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !message.trim()}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {isSubmitting ? "Sending..." : "Share Gratitude"}
                            </GlassButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notes Grid */}
            {notes.length === 0 ? (
                <GlassCard className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-[#ff9a7b] opacity-50" />
                    <p className="text-muted-foreground">
                        No gratitude notes yet. Be the first to share!
                    </p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {notes.map((note, index) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className="p-4 h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={note.author?.avatar_url || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-[#ff9a7b] to-[#ff6b9d] text-white text-xs">
                                                    {note.author?.full_name?.[0] || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {note.author?.full_name || "Anonymous"}
                                                </p>
                                                {note.recipient && (
                                                    <p className="text-xs text-muted-foreground">
                                                        → {note.recipient.full_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {note.author_id === currentUserId && (
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="p-1 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-foreground mb-3">{note.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
