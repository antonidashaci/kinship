"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Calendar, Image, Plus, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { EmotionalMilestone, Profile } from "@/lib/types"
import { format } from "date-fns"

interface MemoryTimelineClientProps {
    milestones: EmotionalMilestone[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

export function MemoryTimelineClient({
    milestones: initialMilestones,
    familyMembers,
    currentUserId,
    familyId,
}: MemoryTimelineClientProps) {
    const [milestones, setMilestones] = useState<EmotionalMilestone[]>(initialMilestones)
    const [showComposer, setShowComposer] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [milestoneDate, setMilestoneDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Group milestones by year
    const groupedMilestones = milestones.reduce((acc, milestone) => {
        const year = new Date(milestone.milestone_date).getFullYear()
        if (!acc[year]) acc[year] = []
        acc[year].push(milestone)
        return acc
    }, {} as Record<number, EmotionalMilestone[]>)

    const years = Object.keys(groupedMilestones).sort((a, b) => Number(b) - Number(a))

    const handleCreateMilestone = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("emotional_milestones")
            .insert({
                family_id: familyId,
                created_by: currentUserId,
                title: title.trim(),
                description: description.trim() || null,
                milestone_date: milestoneDate,
            })
            .select()
            .single()

        if (!error && data) {
            setMilestones([data, ...milestones].sort(
                (a, b) => new Date(b.milestone_date).getTime() - new Date(a.milestone_date).getTime()
            ))
            setTitle("")
            setDescription("")
            setMilestoneDate(format(new Date(), "yyyy-MM-dd"))
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const getMember = (id: string) => familyMembers.find((m) => m.id === id)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Heart className="w-6 h-6 text-rose-500" />
                        Memory Timeline
                    </h2>
                    <p className="text-muted-foreground text-sm">Our family journey</p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Memory
                </GlassButton>
            </div>

            {/* Composer Modal */}
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
                            <h3 className="text-lg font-semibold">Add a Memory</h3>
                            <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="First family vacation"
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-rose-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Description (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What happened? How did it feel?"
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-rose-400 resize-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">When did this happen?</label>
                                <input
                                    type="date"
                                    value={milestoneDate}
                                    onChange={(e) => setMilestoneDate(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-rose-400"
                                />
                            </div>

                            <GlassButton className="w-full" onClick={handleCreateMilestone} disabled={isSubmitting || !title.trim()}>
                                {isSubmitting ? "Adding..." : "Add Memory"}
                            </GlassButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Timeline */}
            {years.length > 0 ? (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400 via-rose-300 to-rose-200" />

                    {years.map((year) => (
                        <div key={year} className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold z-10">
                                    {year.slice(-2)}
                                </div>
                                <h3 className="text-lg font-bold">{year}</h3>
                            </div>

                            <div className="pl-12 space-y-4">
                                {groupedMilestones[Number(year)].map((milestone, index) => {
                                    const creator = getMember(milestone.created_by)
                                    return (
                                        <motion.div
                                            key={milestone.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <GlassCard className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {milestone.image_url ? (
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={milestone.image_url}
                                                                alt={milestone.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center flex-shrink-0">
                                                            <Heart className="w-8 h-8 text-rose-500" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold">{milestone.title}</h4>
                                                        {milestone.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            {format(new Date(milestone.milestone_date), "MMMM d, yyyy")}
                                                            {creator && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Avatar className="w-4 h-4">
                                                                        <AvatarImage src={creator.avatar_url || undefined} />
                                                                        <AvatarFallback className="text-[8px]">{creator.full_name?.[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span>{creator.full_name}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <GlassCard className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-rose-500 opacity-50" />
                    <p className="text-muted-foreground">No memories yet. Start documenting your family's journey!</p>
                </GlassCard>
            )}
        </div>
    )
}
