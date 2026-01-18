"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Heart, Check, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoodIndicator } from "@/components/ui/mood-indicator"
import type { MoodAlert, Profile, MoodType } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface MoodAlertsClientProps {
    alerts: MoodAlert[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

const alertMessages: Record<string, string> = {
    prolonged_negative: "has been feeling down for a while",
    mood_change: "had a sudden mood change",
    check_in_request: "would like you to check in",
}

export function MoodAlertsClient({
    alerts: initialAlerts,
    familyMembers,
    currentUserId,
    familyId,
}: MoodAlertsClientProps) {
    const [alerts, setAlerts] = useState<MoodAlert[]>(initialAlerts)

    const pendingAlerts = alerts.filter((a) => !a.is_acknowledged)
    const acknowledgedAlerts = alerts.filter((a) => a.is_acknowledged)

    const handleAcknowledge = async (alertId: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("mood_alerts")
            .update({ is_acknowledged: true, acknowledged_by: currentUserId })
            .eq("id", alertId)

        if (!error) {
            setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, is_acknowledged: true } : a)))
        }
    }

    const getMember = (id: string) => familyMembers.find((m) => m.id === id)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="w-6 h-6 text-orange-500" />
                    Emotional Check-Ins
                </h2>
                <p className="text-muted-foreground text-sm">Stay connected with your family's wellbeing</p>
            </div>

            {/* Pending Alerts */}
            {pendingAlerts.length > 0 && (
                <div>
                    <h3 className="font-medium mb-3 text-muted-foreground">Needs Attention</h3>
                    <div className="space-y-3">
                        {pendingAlerts.map((alert) => {
                            const member = getMember(alert.user_id)
                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <GlassCard className="p-4 border-2 border-orange-400/30 bg-orange-500/5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="w-12 h-12">
                                                    <AvatarImage src={member?.avatar_url || undefined} />
                                                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                                                        {member?.full_name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1">
                                                    <MoodIndicator mood={alert.triggered_by_mood} size="sm" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{member?.full_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {alertMessages[alert.alert_type] || "needs your attention"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <GlassButton size="sm" onClick={() => handleAcknowledge(alert.id)}>
                                                    <Heart className="w-4 h-4 mr-1" />
                                                    Send Love
                                                </GlassButton>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* All Good State */}
            {pendingAlerts.length === 0 && (
                <GlassCard className="p-8 text-center bg-emerald-500/5 border-2 border-emerald-500/20">
                    <Check className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                    <h3 className="font-semibold text-lg mb-1">Everyone is doing well!</h3>
                    <p className="text-muted-foreground">No emotional check-ins needed right now.</p>
                </GlassCard>
            )}

            {/* Recent Activity */}
            {acknowledgedAlerts.length > 0 && (
                <div>
                    <h3 className="font-medium mb-3 text-muted-foreground">Recent Check-Ins</h3>
                    <div className="space-y-2">
                        {acknowledgedAlerts.slice(0, 5).map((alert) => {
                            const member = getMember(alert.user_id)
                            return (
                                <GlassCard key={alert.id} className="p-3 opacity-60">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={member?.avatar_url || undefined} />
                                            <AvatarFallback className="text-xs">{member?.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="flex-1 text-sm">{member?.full_name}</span>
                                        <span className="text-xs text-emerald-500 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Checked in
                                        </span>
                                    </div>
                                </GlassCard>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
