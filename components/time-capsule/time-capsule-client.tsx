"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Plus, Lock, Unlock, X, Image, MessageSquare, Mic } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { TimeCapsule, TimeCapsuleItem, Profile, TimeCapsuleContentType } from "@/lib/types"
import { format, differenceInDays, isPast } from "date-fns"

interface TimeCapsuleClientProps {
    capsules: TimeCapsule[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

const contentTypeIcons: Record<TimeCapsuleContentType, React.ReactNode> = {
    text: <MessageSquare className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    audio: <Mic className="w-4 h-4" />,
    video: <Image className="w-4 h-4" />,
}

export function TimeCapsuleClient({
    capsules: initialCapsules,
    familyMembers,
    currentUserId,
    familyId,
}: TimeCapsuleClientProps) {
    const [capsules, setCapsules] = useState<TimeCapsule[]>(initialCapsules)
    const [showComposer, setShowComposer] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [unlockDate, setUnlockDate] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeCapsuleId, setActiveCapsuleId] = useState<string | null>(null)
    const [newContent, setNewContent] = useState("")

    const activeCapsule = capsules.find((c) => c.id === activeCapsuleId)
    const lockedCapsules = capsules.filter((c) => !c.is_unlocked && !isPast(new Date(c.unlock_date)))
    const unlockedCapsules = capsules.filter((c) => c.is_unlocked || isPast(new Date(c.unlock_date)))

    const handleCreateCapsule = async () => {
        if (!title.trim() || !unlockDate) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("time_capsules")
            .insert({
                family_id: familyId,
                title: title.trim(),
                description: description.trim() || null,
                unlock_date: unlockDate,
                created_by: currentUserId,
            })
            .select()
            .single()

        if (!error && data) {
            setCapsules([{ ...data, items: [] }, ...capsules])
            setTitle("")
            setDescription("")
            setUnlockDate("")
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleAddItem = async () => {
        if (!newContent.trim() || !activeCapsuleId) return

        const supabase = createClient()
        const { data, error } = await supabase
            .from("time_capsule_items")
            .insert({
                capsule_id: activeCapsuleId,
                contributor_id: currentUserId,
                content_type: "text",
                content: newContent.trim(),
            })
            .select("*, contributor:profiles!contributor_id(full_name, avatar_url)")
            .single()

        if (!error && data) {
            setCapsules(
                capsules.map((c) =>
                    c.id === activeCapsuleId
                        ? { ...c, items: [...(c.items || []), data] }
                        : c
                )
            )
            setNewContent("")
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Clock className="w-6 h-6 text-cyan-500" />
                        Time Capsules
                    </h2>
                    <p className="text-muted-foreground text-sm">Messages for the future</p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Capsule
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
                                <h3 className="text-lg font-semibold">Create Time Capsule</h3>
                                <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Capsule name</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Summer 2024 Memories"
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What is this capsule for?"
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-cyan-400 resize-none"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Unlock date</label>
                                    <input
                                        type="date"
                                        value={unlockDate}
                                        onChange={(e) => setUnlockDate(e.target.value)}
                                        min={format(new Date(), "yyyy-MM-dd")}
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-cyan-400"
                                    />
                                </div>

                                <GlassButton
                                    className="w-full"
                                    onClick={handleCreateCapsule}
                                    disabled={isSubmitting || !title.trim() || !unlockDate}
                                >
                                    {isSubmitting ? "Creating..." : "Create Capsule"}
                                </GlassButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Capsule Detail */}
            {activeCapsule && (
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {isPast(new Date(activeCapsule.unlock_date)) ? (
                                <Unlock className="w-6 h-6 text-emerald-500" />
                            ) : (
                                <Lock className="w-6 h-6 text-amber-500" />
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{activeCapsule.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {isPast(new Date(activeCapsule.unlock_date))
                                        ? "Unlocked!"
                                        : `Unlocks ${format(new Date(activeCapsule.unlock_date), "PPP")}`}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setActiveCapsuleId(null)} className="p-2 rounded-full hover:bg-white/20">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Add Content (only if locked) */}
                    {!isPast(new Date(activeCapsule.unlock_date)) && (
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Add a message for the future..."
                                className="flex-1 p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-cyan-400"
                                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                            />
                            <GlassButton onClick={handleAddItem} disabled={!newContent.trim()}>
                                <Plus className="w-4 h-4" />
                            </GlassButton>
                        </div>
                    )}

                    {/* Items (only visible if unlocked) */}
                    {isPast(new Date(activeCapsule.unlock_date)) ? (
                        <div className="space-y-3">
                            {activeCapsule.items?.map((item) => (
                                <div key={item.id} className="p-3 rounded-xl bg-white/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={item.contributor?.avatar_url || undefined} />
                                            <AvatarFallback className="text-xs">{item.contributor?.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{item.contributor?.full_name}</span>
                                        {contentTypeIcons[item.content_type]}
                                    </div>
                                    <p>{item.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>{activeCapsule.items?.length || 0} items sealed</p>
                            <p className="text-sm">Opens in {differenceInDays(new Date(activeCapsule.unlock_date), new Date())} days</p>
                        </div>
                    )}
                </GlassCard>
            )}

            {/* Capsules Grid */}
            {!activeCapsuleId && (
                <>
                    {unlockedCapsules.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-3 text-muted-foreground flex items-center gap-2">
                                <Unlock className="w-4 h-4" /> Ready to Open
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {unlockedCapsules.map((capsule) => (
                                    <GlassCard
                                        key={capsule.id}
                                        className="p-4 cursor-pointer hover:bg-emerald-500/10 border-2 border-emerald-500/30 transition-colors"
                                        onClick={() => setActiveCapsuleId(capsule.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Unlock className="w-8 h-8 text-emerald-500" />
                                            <div>
                                                <h4 className="font-semibold">{capsule.title}</h4>
                                                <p className="text-sm text-muted-foreground">{capsule.items?.length || 0} memories inside</p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {lockedCapsules.length > 0 && (
                        <div>
                            <h3 className="font-medium mb-3 text-muted-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Sealed Capsules
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lockedCapsules.map((capsule) => (
                                    <GlassCard
                                        key={capsule.id}
                                        className="p-4 cursor-pointer hover:bg-white/20 transition-colors"
                                        onClick={() => setActiveCapsuleId(capsule.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-8 h-8 text-amber-500" />
                                            <div>
                                                <h4 className="font-semibold">{capsule.title}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Opens {format(new Date(capsule.unlock_date), "PPP")}
                                                </p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {capsules.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-cyan-500 opacity-50" />
                    <p className="text-muted-foreground">No time capsules yet. Create one and add memories for the future!</p>
                </GlassCard>
            )}
        </div>
    )
}
