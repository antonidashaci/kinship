"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    Heart,
    ShoppingCart,
    Package,
    Trophy,
    Music,
    Users,
    Clock,
    History,
    Bell,
    MapPin,
    Sparkles
} from "lucide-react"

const features = [
    { name: "Gratitude", icon: Heart, href: "/gratitude", color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "Shopping", icon: ShoppingCart, href: "/shopping", color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Care", icon: Package, href: "/care-packages", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Challenges", icon: Trophy, href: "/challenges", color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Soundtrack", icon: Music, href: "/soundtrack", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Meetings", icon: Users, href: "/meetings", color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Capsule", icon: Clock, href: "/time-capsule", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Timeline", icon: History, href: "/memory-timeline", color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "Alerts", icon: Bell, href: "/mood-alerts", color: "text-orange-600", bg: "bg-orange-600/10" },
    { name: "Location", icon: MapPin, href: "/location", color: "text-sky-500", bg: "bg-sky-500/10" },
]

export function FamilyFeatureGrid() {
    return (
        <div className="h-full">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-foreground">Family Apps</h2>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {features.map((feature, index) => (
                    <Link key={feature.name} href={feature.href}>
                        <motion.div
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center transition-all group-hover:shadow-lg group-hover:scale-105`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground text-center truncate w-full">
                                {feature.name}
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
