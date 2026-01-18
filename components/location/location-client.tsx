"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Home, Bell, Check, X, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LocationPing, LocationSettings, Profile } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface LocationClientProps {
    pings: LocationPing[]
    settings: LocationSettings | null
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

const pingIcons = {
    arrived_home: <Home className="w-4 h-4 text-emerald-500" />,
    left_home: <MapPin className="w-4 h-4 text-blue-500" />,
    check_in: <Bell className="w-4 h-4 text-amber-500" />,
}

const pingMessages = {
    arrived_home: "arrived home safely",
    left_home: "left home",
    check_in: "checked in",
}

export function LocationClient({
    pings: initialPings,
    settings: initialSettings,
    familyMembers,
    currentUserId,
    familyId,
}: LocationClientProps) {
    const [pings, setPings] = useState<LocationPing[]>(initialPings)
    const [settings, setSettings] = useState<LocationSettings | null>(initialSettings)
    const [isSendingPing, setIsSendingPing] = useState(false)

    const handleSendPing = async (type: "arrived_home" | "left_home" | "check_in") => {
        setIsSendingPing(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("location_pings")
            .insert({
                user_id: currentUserId,
                family_id: familyId,
                ping_type: type,
            })
            .select("*, user:profiles!user_id(full_name, avatar_url)")
            .single()

        if (!error && data) {
            setPings([data, ...pings])
        }
        setIsSendingPing(false)
    }

    const handleToggleSharing = async () => {
        const supabase = createClient()

        if (settings) {
            const { error } = await supabase
                .from("location_settings")
                .update({ is_sharing_enabled: !settings.is_sharing_enabled })
                .eq("user_id", currentUserId)

            if (!error) {
                setSettings({ ...settings, is_sharing_enabled: !settings.is_sharing_enabled })
            }
        } else {
            const { data, error } = await supabase
                .from("location_settings")
                .insert({ user_id: currentUserId, is_sharing_enabled: true })
                .select()
                .single()

            if (!error && data) {
                setSettings(data)
            }
        }
    }

    const getMember = (id: string) => familyMembers.find((m) => m.id === id)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-500" />
                        Location Sharing
                    </h2>
                    <p className="text-muted-foreground text-sm">Let family know you&apos;re safe</p>
                </div>
                <button
                    onClick={handleToggleSharing}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${settings?.is_sharing_enabled
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-white/30 text-muted-foreground"
                        }`}
                >
                    {settings?.is_sharing_enabled ? (
                        <>
                            <Check className="w-4 h-4" />
                            Sharing On
                        </>
                    ) : (
                        <>
                            <X className="w-4 h-4" />
                            Sharing Off
                        </>
                    )}
                </button>
            </div>

            {/* Quick Actions */}
            <GlassCard className="p-4">
                <h3 className="font-medium mb-3">Quick Check-In</h3>
                <div className="grid grid-cols-3 gap-3">
                    <GlassButton
                        className="flex-col gap-2 py-4"
                        onClick={() => handleSendPing("arrived_home")}
                        disabled={isSendingPing}
                    >
                        <Home className="w-6 h-6 text-emerald-500" />
                        <span className="text-sm">Home Safe</span>
                    </GlassButton>
                    <GlassButton
                        className="flex-col gap-2 py-4"
                        onClick={() => handleSendPing("left_home")}
                        disabled={isSendingPing}
                    >
                        <MapPin className="w-6 h-6 text-blue-500" />
                        <span className="text-sm">Left Home</span>
                    </GlassButton>
                    <GlassButton
                        className="flex-col gap-2 py-4"
                        onClick={() => handleSendPing("check_in")}
                        disabled={isSendingPing}
                    >
                        <Bell className="w-6 h-6 text-amber-500" />
                        <span className="text-sm">Check In</span>
                    </GlassButton>
                </div>
            </GlassCard>

            {/* Recent Pings */}
            {pings.length > 0 ? (
                <div>
                    <h3 className="font-medium mb-3 text-muted-foreground">Recent Activity</h3>
                    <div className="space-y-2">
                        {pings.map((ping, index) => {
                            const member = getMember(ping.user_id)
                            return (
                                <motion.div
                                    key={ping.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <GlassCard className="p-3 flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={member?.avatar_url || undefined} />
                                            <AvatarFallback>{member?.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium">{member?.full_name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                {pingIcons[ping.ping_type]}
                                                {pingMessages[ping.ping_type]}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(ping.created_at), { addSuffix: true })}
                                        </span>
                                    </GlassCard>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <GlassCard className="p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-500 opacity-50" />
                    <p className="text-muted-foreground">No location updates yet. Tap a quick check-in above!</p>
                </GlassCard>
            )}
        </div>
    )
}
