"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Heart, Phone, Cookie, MapPin, Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CarePackage, CarePackageType, Profile } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface CarePackagesClientProps {
    packages: CarePackage[]
    familyMembers: Profile[]
    currentUserId: string
    familyId: string
}

const packageTypes: { type: CarePackageType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: "hug", label: "Virtual Hug", icon: <Heart className="w-5 h-5" />, color: "from-pink-400 to-rose-500" },
    { type: "snack", label: "Snack Delivery", icon: <Cookie className="w-5 h-5" />, color: "from-amber-400 to-orange-500" },
    { type: "call", label: "Phone Call", icon: <Phone className="w-5 h-5" />, color: "from-blue-400 to-indigo-500" },
    { type: "gift", label: "Surprise Gift", icon: <Gift className="w-5 h-5" />, color: "from-purple-400 to-violet-500" },
    { type: "visit", label: "Visit Me", icon: <MapPin className="w-5 h-5" />, color: "from-emerald-400 to-teal-500" },
]

export function CarePackagesClient({
    packages: initialPackages,
    familyMembers,
    currentUserId,
    familyId,
}: CarePackagesClientProps) {
    const [packages, setPackages] = useState<CarePackage[]>(initialPackages)
    const [showComposer, setShowComposer] = useState(false)
    const [selectedType, setSelectedType] = useState<CarePackageType>("hug")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const myRequests = packages.filter((p) => p.requester_id === currentUserId && !p.is_fulfilled)
    const openRequests = packages.filter((p) => p.requester_id !== currentUserId && !p.is_fulfilled)
    const fulfilledPackages = packages.filter((p) => p.is_fulfilled)

    const handleSubmit = async () => {
        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase
            .from("care_packages")
            .insert({
                family_id: familyId,
                requester_id: currentUserId,
                request_type: selectedType,
                message: message.trim() || null,
            })
            .select("*, requester:profiles!requester_id(full_name, avatar_url)")
            .single()

        if (!error && data) {
            setPackages([data, ...packages])
            setMessage("")
            setShowComposer(false)
        }
        setIsSubmitting(false)
    }

    const handleFulfill = async (packageId: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("care_packages")
            .update({
                is_fulfilled: true,
                fulfiller_id: currentUserId,
                fulfilled_at: new Date().toISOString(),
            })
            .eq("id", packageId)

        if (!error) {
            setPackages(
                packages.map((p) =>
                    p.id === packageId
                        ? { ...p, is_fulfilled: true, fulfiller_id: currentUserId, fulfilled_at: new Date().toISOString() }
                        : p
                )
            )
        }
    }

    const handleDelete = async (packageId: string) => {
        const supabase = createClient()
        const { error } = await supabase.from("care_packages").delete().eq("id", packageId)

        if (!error) {
            setPackages(packages.filter((p) => p.id !== packageId))
        }
    }

    const getTypeConfig = (type: CarePackageType) => packageTypes.find((t) => t.type === type)!

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Gift className="w-6 h-6 text-purple-500" />
                        Care Packages
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Request or send love to your family
                    </p>
                </div>
                <GlassButton onClick={() => setShowComposer(true)}>
                    <Gift className="w-4 h-4 mr-2" />
                    Request Care
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
                                <h3 className="text-lg font-semibold">Request a Care Package</h3>
                                <button onClick={() => setShowComposer(false)} className="p-2 rounded-full hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">What do you need?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {packageTypes.map((pt) => (
                                        <button
                                            key={pt.type}
                                            className={`p-3 rounded-xl flex items-center gap-2 transition-all ${selectedType === pt.type
                                                    ? `bg-gradient-to-r ${pt.color} text-white`
                                                    : "bg-white/30 hover:bg-white/50"
                                                }`}
                                            onClick={() => setSelectedType(pt.type)}
                                        >
                                            {pt.icon}
                                            <span className="text-sm">{pt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm text-muted-foreground mb-2 block">Add a note (optional)</label>
                                <textarea
                                    className="w-full p-3 rounded-xl bg-white/30 border-0 focus:ring-2 focus:ring-purple-400 resize-none"
                                    rows={3}
                                    placeholder="I could really use..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <GlassButton className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Request"}
                            </GlassButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Open Requests from Family */}
            {openRequests.length > 0 && (
                <div>
                    <h3 className="font-medium mb-3 text-muted-foreground">Family Needs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {openRequests.map((pkg) => {
                            const config = getTypeConfig(pkg.request_type)
                            return (
                                <GlassCard key={pkg.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${config.color} text-white`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={pkg.requester?.avatar_url || undefined} />
                                                    <AvatarFallback className="text-xs">{pkg.requester?.full_name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm">{pkg.requester?.full_name}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">wants a {config.label.toLowerCase()}</p>
                                            {pkg.message && <p className="text-sm mb-2">&quot;{pkg.message}&quot;</p>}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(pkg.created_at), { addSuffix: true })}
                                                </span>
                                                <GlassButton size="sm" onClick={() => handleFulfill(pkg.id)}>
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Fulfill
                                                </GlassButton>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* My Requests */}
            {myRequests.length > 0 && (
                <div>
                    <h3 className="font-medium mb-3 text-muted-foreground">My Requests</h3>
                    <div className="space-y-2">
                        {myRequests.map((pkg) => {
                            const config = getTypeConfig(pkg.request_type)
                            return (
                                <GlassCard key={pkg.id} className="p-3 flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                                        {config.icon}
                                    </div>
                                    <span className="flex-1">{config.label}</span>
                                    <span className="text-xs text-muted-foreground">Waiting...</span>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="p-1 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </GlassCard>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {packages.length === 0 && (
                <GlassCard className="p-8 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-purple-500 opacity-50" />
                    <p className="text-muted-foreground">No care packages yet. Request one or wait for family needs!</p>
                </GlassCard>
            )}
        </div>
    )
}
