"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Plus, Check, Users, Calendar, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { Challenge, Profile } from "@/lib/types"
import { format, differenceInDays } from "date-fns"

interface ChallengesClientProps {
    challenges: Challenge[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

const challengeIcons = ["🎯", "🏃", "📚", "🧘", "🍳", "🎨", "🎮", "🌱", "💪", "🧹"]

export function ChallengesClient({
    challenges: initialChallenges,
    familyMembers,
    currentUserId,
    familyId,
}: ChallengesClientProps) {
    const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
    const [showComposer, setShowComposer] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedIcon, setSelectedIcon] = useState("🎯")
    const [endDate, setEndDate] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const activeChallenges = challenges.filter((c) => !c.is_completed)
    const completedChallenges = challenges.filter((c) => c.is_completed)

    const handleSubmit = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("challenges")
            .insert({
                family_id: familyId,
                title: title.trim(),
                description: description.trim() || null,
                icon: selectedIcon,
                end_date: endDate || null,
                created_by: currentUserId,
            })
            .select()
            .single()

        if (!error && data) {
            setChallenges([{ ...data, participants: [] }, ...challenges])
            setTitle("")
            setDescription("")
            setEndDate("")
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleJoin = async (challengeId: string) => {
        const supabase = createClient()
        const { error } = await supabase.from("challenge_participants").insert({
            challenge_id: challengeId,
            user_id: currentUserId,
        })

        if (!error) {
            setChallenges(
                challenges.map((c) =>
                    c.id === challengeId
                        ? {
                            ...c,
                            participants: [
                                ...(c.participants || []),
                                { id: "", challenge_id: challengeId, user_id: currentUserId, has_completed: false, completed_at: null },
                            ],
                        }
                        : c
                )
            )
        }
    }

    const handleComplete = async (challengeId: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("challenge_participants")
            .update({ has_completed: true, completed_at: new Date().toISOString() })
            .eq("challenge_id", challengeId)
            .eq("user_id", currentUserId)

        if (!error) {
            setChallenges(
                challenges.map((c) =>
                    c.id === challengeId
                        ? {
                            ...c,
                            participants: c.participants?.map((p) =>
                                p.user_id === currentUserId ? { ...p, has_completed: true } : p
                            ),
                        }
                        : c
                )
            )
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Family Challenges
                    </h2>
                    <p className="text-muted-foreground text-sm">Grow together as a family</p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Challenge
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
                                <h3 className="text-lg font-semibold">Create Challenge</h3>
                                <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">Pick an icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {challengeIcons.map((icon) => (
                                        <button
                                            key={icon}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${selectedIcon === icon ? "bg-amber-400/30 ring-2 ring-amber-400" : "bg-white/30 hover:bg-white/50"
                                                }`}
                                            onClick={() => setSelectedIcon(icon)}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">Challenge title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="No Screens Sunday"
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-amber-400"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's this challenge about?"
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-amber-400 resize-none"
                                    rows={2}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">End date (optional)</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-amber-400"
                                />
                            </div>

                            <GlassButton className="w-full" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                                {isSubmitting ? "Creating..." : "Create Challenge"}
                            </GlassButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Challenges */}
            {activeChallenges.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeChallenges.map((challenge) => {
                        const myParticipation = challenge.participants?.find((p) => p.user_id === currentUserId)
                        const completedCount = challenge.participants?.filter((p) => p.has_completed).length || 0
                        const totalParticipants = challenge.participants?.length || 0
                        const daysLeft = challenge.end_date ? differenceInDays(new Date(challenge.end_date), new Date()) : null

                        return (
                            <GlassCard key={challenge.id} className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="text-3xl">{challenge.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{challenge.title}</h3>
                                        {challenge.description && (
                                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                                        )}
                                    </div>
                                </div>

                                {totalParticipants > 0 && (
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span>
                                                {completedCount}/{totalParticipants} completed
                                            </span>
                                        </div>
                                        <Progress value={(completedCount / totalParticipants) * 100} className="h-2" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        {totalParticipants} joined
                                        {daysLeft !== null && (
                                            <>
                                                <Calendar className="w-4 h-4 ml-2" />
                                                {daysLeft > 0 ? `${daysLeft}d left` : "Ends today"}
                                            </>
                                        )}
                                    </div>
                                    {!myParticipation ? (
                                        <GlassButton size="sm" onClick={() => handleJoin(challenge.id)}>
                                            Join
                                        </GlassButton>
                                    ) : !myParticipation.has_completed ? (
                                        <GlassButton size="sm" onClick={() => handleComplete(challenge.id)}>
                                            <Check className="w-4 h-4 mr-1" />
                                            Done
                                        </GlassButton>
                                    ) : (
                                        <span className="text-sm text-emerald-500 flex items-center gap-1">
                                            <Check className="w-4 h-4" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            )}

            {/* Empty State */}
            {challenges.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500 opacity-50" />
                    <p className="text-muted-foreground">No challenges yet. Create your first family challenge!</p>
                </GlassCard>
            )}
        </div>
    )
}
