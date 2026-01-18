"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, ThumbsUp, ThumbsDown, Check, MessageSquare, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import type { FamilyMeeting, MeetingAgendaItem, Profile } from "@/lib/types"
import { format } from "date-fns"

interface MeetingsClientProps {
    meetings: FamilyMeeting[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

export function MeetingsClient({
    meetings: initialMeetings,
    familyMembers,
    currentUserId,
    familyId,
}: MeetingsClientProps) {
    const [meetings, setMeetings] = useState<FamilyMeeting[]>(initialMeetings)
    const [showComposer, setShowComposer] = useState(false)
    const [title, setTitle] = useState("")
    const [scheduledFor, setScheduledFor] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null)
    const [newAgendaItem, setNewAgendaItem] = useState("")

    const activeMeeting = meetings.find((m) => m.id === activeMeetingId)

    const handleCreateMeeting = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("family_meetings")
            .insert({
                family_id: familyId,
                title: title.trim(),
                scheduled_for: scheduledFor || null,
                created_by: currentUserId,
            })
            .select()
            .single()

        if (!error && data) {
            setMeetings([{ ...data, agenda_items: [] }, ...meetings])
            setTitle("")
            setScheduledFor("")
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleAddAgendaItem = async () => {
        if (!newAgendaItem.trim() || !activeMeetingId) return

        const supabase = createClient()
        const { data, error } = await supabase
            .from("meeting_agenda_items")
            .insert({
                meeting_id: activeMeetingId,
                item_text: newAgendaItem.trim(),
                proposed_by: currentUserId,
            })
            .select()
            .single()

        if (!error && data) {
            setMeetings(
                meetings.map((m) =>
                    m.id === activeMeetingId
                        ? { ...m, agenda_items: [...(m.agenda_items || []), data] }
                        : m
                )
            )
            setNewAgendaItem("")
        }
    }

    const handleVote = async (itemId: string, isFor: boolean) => {
        const supabase = createClient()
        const meeting = meetings.find((m) => m.agenda_items?.some((i) => i.id === itemId))
        const item = meeting?.agenda_items?.find((i) => i.id === itemId)
        if (!item) return

        const update = isFor
            ? { votes_for: item.votes_for + 1 }
            : { votes_against: item.votes_against + 1 }

        const { error } = await supabase
            .from("meeting_agenda_items")
            .update(update)
            .eq("id", itemId)

        if (!error) {
            setMeetings(
                meetings.map((m) => ({
                    ...m,
                    agenda_items: m.agenda_items?.map((i) =>
                        i.id === itemId ? { ...i, ...update } : i
                    ),
                }))
            )
        }
    }

    const handleResolve = async (itemId: string, decision: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("meeting_agenda_items")
            .update({ is_resolved: true, decision })
            .eq("id", itemId)

        if (!error) {
            setMeetings(
                meetings.map((m) => ({
                    ...m,
                    agenda_items: m.agenda_items?.map((i) =>
                        i.id === itemId ? { ...i, is_resolved: true, decision } : i
                    ),
                }))
            )
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        Family Meetings
                    </h2>
                    <p className="text-muted-foreground text-sm">Discuss and decide together</p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Meeting
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
                                <h3 className="text-lg font-semibold">Schedule a Meeting</h3>
                                <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">Meeting title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Weekly Family Sync"
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-2 block">When? (optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={scheduledFor}
                                        onChange={(e) => setScheduledFor(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <GlassButton className="w-full" onClick={handleCreateMeeting} disabled={isSubmitting || !title.trim()}>
                                    {isSubmitting ? "Creating..." : "Create Meeting"}
                                </GlassButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Meeting Detail View */}
            {activeMeeting && (
                <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg">{activeMeeting.title}</h3>
                            {activeMeeting.scheduled_for && (
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(activeMeeting.scheduled_for), "PPp")}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setActiveMeetingId(null)}
                            className="p-2 rounded-full hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Add Agenda Item */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newAgendaItem}
                            onChange={(e) => setNewAgendaItem(e.target.value)}
                            placeholder="Add agenda item..."
                            className="flex-1 p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-blue-400"
                            onKeyDown={(e) => e.key === "Enter" && handleAddAgendaItem()}
                        />
                        <GlassButton onClick={handleAddAgendaItem} disabled={!newAgendaItem.trim()}>
                            <Plus className="w-4 h-4" />
                        </GlassButton>
                    </div>

                    {/* Agenda Items */}
                    <div className="space-y-3">
                        {activeMeeting.agenda_items?.map((item) => (
                            <div
                                key={item.id}
                                className={`p-3 rounded-xl ${item.is_resolved ? "bg-emerald-500/10" : "bg-white/20"}`}
                            >
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-5 h-5 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className={item.is_resolved ? "line-through text-muted-foreground" : ""}>
                                            {item.item_text}
                                        </p>
                                        {item.decision && (
                                            <p className="text-sm text-emerald-600 mt-1">Decision: {item.decision}</p>
                                        )}
                                    </div>
                                    {!item.is_resolved && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleVote(item.id, true)}
                                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30"
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                                <span className="text-xs">{item.votes_for}</span>
                                            </button>
                                            <button
                                                onClick={() => handleVote(item.id, false)}
                                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30"
                                            >
                                                <ThumbsDown className="w-4 h-4" />
                                                <span className="text-xs">{item.votes_against}</span>
                                            </button>
                                            <button
                                                onClick={() => handleResolve(item.id, "Approved")}
                                                className="p-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}

            {/* Meetings List */}
            {!activeMeetingId && meetings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meetings.map((meeting) => (
                        <GlassCard
                            key={meeting.id}
                            className="p-4 cursor-pointer hover:bg-white/20 transition-colors"
                            onClick={() => setActiveMeetingId(meeting.id)}
                        >
                            <h3 className="font-semibold mb-1">{meeting.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {meeting.scheduled_for
                                    ? format(new Date(meeting.scheduled_for), "PPp")
                                    : "Not scheduled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {meeting.agenda_items?.length || 0} agenda items
                            </p>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {meetings.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-blue-500 opacity-50" />
                    <p className="text-muted-foreground">No meetings yet. Schedule your first family meeting!</p>
                </GlassCard>
            )}
        </div>
    )
}
